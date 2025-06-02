import { Book } from "@/app/types";
import ForLaterList from "./ForLaterList";
import { cookies } from "next/headers";

export default async function ForLaterPage() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch("http://localhost:3000/api/for_later", {
      cache: "no-cache",
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (response.status === 404) {
      return <div>No user found</div>;
    }
    if (!response.ok) {
      return <div>Failed to load books</div>;
    }

    const forLaterBooks: Book[] = await response.json();

    return <ForLaterList initialForLaterBooks={forLaterBooks} />;
  } catch (error) {
    return <div>Something went wrong.</div>;
  }
}

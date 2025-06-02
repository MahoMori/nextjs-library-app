import { Book } from "@/app/types";
import ForLaterList from "./ForLaterList";
import { cookies } from "next/headers";

export default async function ForLaterPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch("http://localhost:3000/api/for_later", {
      cache: "no-cache",
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (response.status === 401) {
      window.location.href = "/sign-in";
      return <div>Unauthorized</div>;
    }
    if (response.status === 404) {
      return <div>No user found</div>;
    }
    if (!response.ok) {
      return <div>Failed to load books</div>;
    }

    const forLaterBooks: Book[] = await response.json();

    return <ForLaterList initialForLaterBooks={forLaterBooks} />;
  } catch (error) {
    console.error("Error fetching for later books:", error);
    return <div>Something went wrong.</div>;
  }
}

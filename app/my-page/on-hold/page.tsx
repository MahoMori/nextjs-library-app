import { Book } from "@/app/types";
import OnHoldList from "./OnHoldList";
import { cookies } from "next/headers";

export default async function OnHoldPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch("http://localhost:3000/api/hold", {
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

    const onHoldBooks: Book[] = await response.json();

    return <OnHoldList initialOnHoldBooks={onHoldBooks} />;
  } catch (error) {
    console.error("Error fetching on hold books:", error);
    return <div>Something went wrong.</div>;
  }
}

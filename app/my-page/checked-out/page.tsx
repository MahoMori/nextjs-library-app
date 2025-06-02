import { Book } from "@/app/types";
import CheckedOutList from "./CheckedOutList";
import { cookies } from "next/headers";

export default async function CheckedOutPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch("http://localhost:3000/api/checked_out", {
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

    const checkedOutBooks: Book[] = await response.json();

    return <CheckedOutList initialCheckedOutBooks={checkedOutBooks} />;
  } catch (error) {
    console.error("Error fetching checked out books:", error);
    return <div>Something went wrong.</div>;
  }
}

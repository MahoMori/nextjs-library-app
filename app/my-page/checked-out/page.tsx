import { Book } from "@/app/types";
import CheckedOutList from "./CheckedOutList";

export default async function CheckedOutPage() {
  try {
    const response = await fetch("http://localhost:3000/api/checked_out", {
      cache: "no-cache",
      headers: {
        Authorization: "Bearer faketoken123", // fake JWT for testing
      },
    });

    if (response.status === 404) {
      return <div>No user found</div>;
    }
    if (!response.ok) {
      return <div>Failed to load books</div>;
    }

    const checkedOutBooks: Book[] = await response.json();

    return <CheckedOutList initialCheckedOutBooks={checkedOutBooks} />;
  } catch (error) {
    return <div>Something went wrong.</div>;
  }
}

import { Book } from "@/app/types";
import OnHoldList from "./OnHoldList";

export default async function OnHoldPage() {
  try {
    const response = await fetch("http://localhost:3000/api/hold", {
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

    const onHoldBooks: Book[] = await response.json();

    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">For Later Shelf</h1>
        <OnHoldList initialOnHoldBooks={onHoldBooks} />
      </div>
    );
  } catch (error) {
    return <div>Something went wrong.</div>;
  }
}

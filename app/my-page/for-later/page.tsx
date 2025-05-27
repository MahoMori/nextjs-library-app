import { Book } from "@/app/book-data";
import ForLaterList from "./ForLaterList";

export default async function ForLaterPage() {
  const response = await fetch("http://localhost:3000/api/for_later", {
    cache: "no-cache",
    headers: {
      Authorization: "Bearer faketoken123", // fake JWT for testing
    },
  });

  if (response.status === 404) {
    return <div>No user found</div>;
  }
  const forLaterBooks: Book[] = await response.json();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">For Later Shelf</h1>
      <ForLaterList initialForLaterBooks={forLaterBooks} />
    </div>
  );
}

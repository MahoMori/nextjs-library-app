"use client";

import { useState } from "react";
import { Book } from "@/app/book-data";

export default function ForLaterList({
  initialForLaterBooks,
}: {
  initialForLaterBooks: Book[];
}) {
  const [forLaterBooks, setForLaterBooks] =
    useState<Book[]>(initialForLaterBooks);

  const removeFromShelf = async (id: string) => {
    const response = await fetch(`http://localhost:3000/api/for_later/${id}`, {
      cache: "no-cache",
      method: "DELETE",
      headers: {
        Authorization: "Bearer faketoken123",
      },
    });
    const updatedForLaterBooks = await response.json();
    setForLaterBooks(updatedForLaterBooks);
  };

  return (
    <div>
      {forLaterBooks.length > 0 ? (
        <div>
          {forLaterBooks.map((book: Book, index: number) => (
            <div key={index} className="mb-2">
              <p>
                {book.title} - {book.author}
              </p>
              <p>Number of holds: {book.num_of_holds}</p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
                onClick={() => removeFromShelf(book.id)}
              >
                Remove from Shelf
              </button>
              {/* borrow button */}
              {/* hold button */}
            </div>
          ))}
        </div>
      ) : (
        <div>No item</div>
      )}
    </div>
  );
}

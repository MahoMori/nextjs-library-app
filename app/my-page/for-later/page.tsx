"use client";

import { useState } from "react";
import { books, Book } from "@/app/book-data";

export default function ForLaterPage() {
  const [forLaterIds] = useState<number[]>([65, 34, 52]);

  const forLaterBooks = forLaterIds
    .map((id) => books.find((book) => book.id === id))
    .filter((book): book is Book => book !== undefined);

  const removeFromShelf = (id: number) => {};

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Checked Out Items</h1>
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

"use client";

import { useState } from "react";
import { books, Book } from "@/app/book-data";

export default function OnHoldPage() {
  const [onHoldIds] = useState<number[]>([12, 45]);

  const onHoldBooks = onHoldIds
    .map((id) => books.find((book) => book.id === id))
    .filter((book): book is Book => book !== undefined);

  const cancelHold = (id: number) => {};

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Checked Out Items</h1>
      {onHoldBooks.length > 0 ? (
        <div>
          {onHoldBooks.map((book: Book, index: number) => (
            <div key={index} className="mb-2">
              <p>
                {book.title} - {book.author}
              </p>
              <p>You are in number XX of {book.num_of_holds}</p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
                onClick={() => cancelHold(book.id)}
              >
                Cancel Hold
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>No item</div>
      )}
    </div>
  );
}

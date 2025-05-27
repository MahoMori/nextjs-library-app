"use client";

import { useState } from "react";
import { books, Book } from "@/app/book-data";

export default function CheckedOutPage() {
  const [checkedOutIds] = useState<number[]>([21, 56]);

  const checkedOutBooks = checkedOutIds
    .map((id) => books.find((book) => book.id === id))
    .filter((book): book is Book => book !== undefined);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Checked Out Items</h1>
      {checkedOutBooks.length > 0 ? (
        <div>
          {checkedOutBooks.map((book: Book, index: number) => (
            <div key={index} className="mb-2">
              <p>
                {book.title} - {book.author}
              </p>
              {/* <p>Remaining: {book.remaining_days} days</p> */}
              <p>Holds number: {book.num_of_holds}</p>
              {book.num_of_holds > 0 ? (
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded "
                  disabled
                >
                  You cannot renew this item
                </button>
              ) : (
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer">
                  Renew
                </button>
              )}
              {/* renew count */}
            </div>
          ))}
        </div>
      ) : (
        <div>No item</div>
      )}
    </div>
  );
}

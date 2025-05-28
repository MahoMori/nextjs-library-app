"use client";

import { useState } from "react";
import { Book } from "@/app/types";

export default function OnHoldList({
  initialOnHoldBooks,
}: {
  initialOnHoldBooks: Book[];
}) {
  const [onHoldBooks, setOnHoldBooks] = useState<Book[]>(initialOnHoldBooks);

  const cancelHold = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/hold/${id}`, {
        cache: "no-cache",
        method: "DELETE",
        headers: {
          Authorization: "Bearer faketoken123",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to cancel hold");
      }
      setOnHoldBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Failed to cancel hold:", error);
    }
  };

  return (
    <div>
      {onHoldBooks.length > 0 ? (
        <div>
          {onHoldBooks.map((book: Book, index: number) => (
            <div key={index} className="mb-2">
              <p>
                {book.title} - {book.author}
              </p>
              <p>
                You are #{book.usernum_in_line} on {book.num_of_copies} copies
              </p>
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

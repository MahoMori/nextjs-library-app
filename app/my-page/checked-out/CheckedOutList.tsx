"use client";

import { useState } from "react";
import { Book, UserCheckedOut } from "@/app/types";

export default function CheckedOutList({
  initialCheckedOutBooks,
}: {
  initialCheckedOutBooks: Book[];
}) {
  const [checkedOutBooks, setCheckedOutBooks] = useState<Book[]>(
    initialCheckedOutBooks
  );

  const renew = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/checked_out/${id}`,
        {
          cache: "no-cache",
          method: "PUT",
          headers: {
            Authorization: "Bearer faketoken123",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to renew");
      }
      const updatedUser = await response.json();
      const updatedCheckedOutItem: UserCheckedOut =
        updatedUser.checked_out.find((item: UserCheckedOut) => item.id === id);

      setCheckedOutBooks((prevBooks) =>
        prevBooks.map((book) => {
          if (book.id === id) {
            return {
              ...book,
              remaining_days: updatedCheckedOutItem.remaining_days,
              renew_count: updatedCheckedOutItem.renew_count,
            };
          }
          return book;
        })
      );
    } catch (error) {
      console.error("Failed to renew:", error);
    }
  };

  return (
    <div>
      {checkedOutBooks.length > 0 ? (
        <div>
          {checkedOutBooks.map((book: Book, index: number) => (
            <div key={index} className="mb-2">
              <p>
                {book.title} - {book.author}
              </p>

              <p className="text-gray-100">
                Holds: {book.num_of_holds} on {book.num_of_copies} copies
              </p>
              <p>Remaining days: {book.remaining_days} days</p>
              <p>You can renew {book.renew_count} / 3 times.</p>
              {book.renew_count! < 3 &&
              book.num_of_holds < book.num_of_copies ? (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
                  onClick={() => renew(book.id)}
                >
                  Renew
                </button>
              ) : (
                <p className="text-gray-500">Cannot renew</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>No item</div>
      )}
    </div>
  );
}

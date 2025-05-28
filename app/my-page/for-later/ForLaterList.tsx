"use client";

import { useState } from "react";
import { Book } from "@/app/types";
import Image from "next/image";

export default function ForLaterList({
  initialForLaterBooks,
}: {
  initialForLaterBooks: Book[];
}) {
  const [forLaterBooks, setForLaterBooks] =
    useState<Book[]>(initialForLaterBooks);

  const removeFromShelf = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/for_later/${id}`,
        {
          cache: "no-cache",
          method: "DELETE",
          headers: {
            Authorization: "Bearer faketoken123",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove book from shelf");
      }
      setForLaterBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== id)
      );
    } catch (error) {
      console.error("Failed to remove book from shelf:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {forLaterBooks.map((book: Book, index: number) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden group flex flex-col" // <-- add flex flex-col
        >
          <div className="aspect-[3/4] relative bg-gray-100">
            <Image
              src={book.book_cover}
              alt={`${book.title} cover`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            <div className="absolute top-2 right-2"></div>
          </div>

          {/* Book Details */}
          <div className="p-6 flex flex-col flex-1">
            {" "}
            {/* <-- add flex-1 */}
            <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 transition-colors">
              {book.title}
            </h3>
            <p className="text-slate-600 mb-4 font-medium">by {book.author}</p>
            <div className="flex-1"></div>{" "}
            {/* <-- spacer to push button down */}
            <button
              onClick={() => removeFromShelf(book.id)}
              className="w-full bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/button cursor-pointer mt-4"
            >
              <svg
                className="w-4 h-4 group-hover/button:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Remove from Shelf
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

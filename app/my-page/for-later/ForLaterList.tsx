"use client";

import { useState } from "react";
import { Book } from "@/app/types";
import Image from "next/image";
import Link from "next/link";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                For Later
              </h1>
              <p className="text-slate-600">Your reading wishlist</p>
            </div>
          </div>

          {forLaterBooks.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  {forLaterBooks.length}{" "}
                  {forLaterBooks.length === 1 ? "book" : "books"} saved
                </span>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Books with holds may have longer wait times
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Books List */}
        {forLaterBooks.length > 0 ? (
          <div className="space-y-4">
            {forLaterBooks.map((book: Book, index: number) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row min-h-48">
                  {/* Book Cover */}
                  <div className="lg:w-32 h-48 lg:h-auto bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center flex-shrink-0 relative min-h-0">
                    <Image
                      src={book.book_cover}
                      alt={`${book.title} cover`}
                      fill
                      className="object-contain lg:object-cover"
                      sizes="(max-width: 1024px) 100vw, 8rem"
                    />
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-slate-800 mb-2">
                          {book.title}
                        </h3>
                        <p className="text-slate-600 font-medium mb-4">
                          by {book.author}
                        </p>

                        {/* Holds Information */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4 text-amber-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-sm text-slate-600">
                              {book.num_of_holds} holds on {book.num_of_copies}{" "}
                              copies
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="lg:ml-6">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No books saved yet
              </h3>
              <p className="text-slate-600 mb-6">
                Start building your reading wishlist by adding books youd like
                to read later.
              </p>
              <Link
                href="/"
                className="bg-emerald-600  text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Browse Books
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Book } from "@/app/types";
import Image from "next/image";

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

  const getEstimatedWaitTime = (position: number, copies: number) => {
    const weeksPerCopy = 3; // Assume 3 weeks per checkout
    const estimatedWeeks = Math.ceil((position / copies) * weeksPerCopy);

    if (estimatedWeeks <= 1) return "Available soon";
    if (estimatedWeeks <= 4) return `~${estimatedWeeks} weeks`;
    return `~${Math.ceil(estimatedWeeks / 4)} months`;
  };

  const getPriorityLevel = (position: number, copies: number) => {
    const ratio = position / copies;
    if (ratio <= 1)
      return { level: "high", color: "emerald", text: "Next up!" };
    if (ratio <= 3) return { level: "medium", color: "amber", text: "Soon" };
    return { level: "low", color: "red", text: "Long wait" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-amber-600"
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
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                On Hold
              </h1>
              <p className="text-slate-600">
                Books reserved and waiting for you
              </p>
            </div>
          </div>

          {onHoldBooks.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  {onHoldBooks.length}{" "}
                  {onHoldBooks.length === 1 ? "book" : "books"} on hold
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
                  Youll be notified when books become available
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Books List */}
        {onHoldBooks.length > 0 ? (
          <div className="space-y-4">
            {onHoldBooks.map((book: Book, index: number) => {
              const priority = getPriorityLevel(
                book.usernum_in_line!,
                book.num_of_copies
              );
              const waitTime = getEstimatedWaitTime(
                book.usernum_in_line!,
                book.num_of_copies
              );

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Book Cover */}
                    <div className="lg:w-32 h-48 lg:h-auto bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0 relative min-h-0">
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

                          {/* Queue Information */}
                          <div className="flex flex-wrap items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-5 h-5 text-amber-600 mr-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                  />
                                </svg>
                                <span className="font-semibold text-slate-800">
                                  #{book.usernum_in_line}
                                </span>
                                <span className="text-slate-600">
                                  on {book.num_of_copies} copies
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Priority and Wait Time */}
                          <div className="flex flex-wrap items-center gap-3">
                            <div
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                priority.color === "emerald"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : priority.color === "amber"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  priority.color === "emerald"
                                    ? "bg-emerald-500"
                                    : priority.color === "amber"
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                              {priority.text}
                            </div>

                            <div className="flex items-center gap-1 text-sm text-slate-600">
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
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Estimated wait: {waitTime}
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="lg:ml-6">
                          <button
                            onClick={() => cancelHold(book.id)}
                            className="w-full lg:w-auto bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                          >
                            <svg
                              className="w-4 h-4 group-hover:scale-110 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Cancel Hold
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No books on hold
              </h3>
              <p className="text-slate-600 mb-6">
                When you place a hold on a popular book, it will appear here
                with your position in the queue.
              </p>
              <button className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2">
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
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

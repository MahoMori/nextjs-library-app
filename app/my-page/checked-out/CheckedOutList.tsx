"use client";

import { useState } from "react";
import { Book, UserCheckedOut } from "@/app/types";
import Image from "next/image";

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

  const getRenewalStatus = (book: Book) => {
    if (book.renew_count! >= 3 || book.num_of_holds > book.num_of_copies) {
      return {
        canRenew: false,
        message: "Maximum renewals reached",
        color: "red",
      };
    } else {
      return {
        canRenew: true,
        message: `${book.renew_count}/3 renewals used`,
        color: "emerald",
      };
    }
  };

  const getDueStatus = (days: number) => {
    if (days <= 0) return { text: "Overdue", color: "red", urgent: true };
    if (days <= 3) return { text: "Due soon", color: "amber", urgent: false };
    return { text: "On time", color: "emerald", urgent: false };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                Checked Out
              </h1>
              <p className="text-slate-600">Books currently borrowed</p>
            </div>
          </div>

          {checkedOutBooks.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  {checkedOutBooks.length}{" "}
                  {checkedOutBooks.length === 1 ? "book" : "books"} checked out
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
                  Remember to return or renew before due dates
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Books List */}
        {checkedOutBooks.length > 0 ? (
          <div className="space-y-4">
            {checkedOutBooks.map((book: Book, index: number) => {
              const renewalStatus = getRenewalStatus(book);
              const dueStatus = getDueStatus(book.remaining_days!);

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Book Cover */}
                    <div className="lg:w-32 h-48 lg:h-auto bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 relative min-h-0">
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

                          {/* Due Date and Renewal Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Due Date */}
                            <div className="flex items-start gap-3">
                              <div
                                className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  dueStatus.color === "emerald"
                                    ? "bg-emerald-100"
                                    : dueStatus.color === "amber"
                                    ? "bg-amber-100"
                                    : "bg-red-100"
                                }`}
                              >
                                <svg
                                  className={`w-4 h-4 ${
                                    dueStatus.color === "emerald"
                                      ? "text-emerald-600"
                                      : dueStatus.color === "amber"
                                      ? "text-amber-600"
                                      : "text-red-600"
                                  } ${dueStatus.urgent ? "animate-pulse" : ""}`}
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
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`font-medium ${
                                      dueStatus.color === "emerald"
                                        ? "text-emerald-600"
                                        : dueStatus.color === "amber"
                                        ? "text-amber-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {dueStatus.text}
                                  </span>
                                  <span className="text-slate-600">
                                    {book.remaining_days! <= 0
                                      ? `${Math.abs(
                                          book.remaining_days!
                                        )} days overdue`
                                      : `${book.remaining_days!} days remaining`}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">
                                  {book.remaining_days! <= 0
                                    ? "Please return or renew immediately"
                                    : book.remaining_days! <= 3
                                    ? "Return or renew soon"
                                    : "Enjoy your reading"}
                                </p>
                              </div>
                            </div>

                            {/* Renewal Status */}
                            <div className="flex items-start gap-3">
                              <div
                                className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  renewalStatus.color === "emerald"
                                    ? "bg-emerald-100"
                                    : renewalStatus.color === "amber"
                                    ? "bg-amber-100"
                                    : "bg-red-100"
                                }`}
                              >
                                <svg
                                  className={`w-4 h-4 ${
                                    renewalStatus.color === "emerald"
                                      ? "text-emerald-600"
                                      : renewalStatus.color === "amber"
                                      ? "text-amber-600"
                                      : "text-red-600"
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                              </div>
                              <div>
                                <div className="font-medium text-slate-700">
                                  Renewals
                                </div>
                                <p className="text-sm text-slate-600 mt-1">
                                  {renewalStatus.message}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Holds Information */}
                          <div className="flex items-center gap-2 text-sm text-slate-600">
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
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <span>
                              {book.num_of_holds}{" "}
                              {book.num_of_holds === 1 ? "hold" : "holds"} on{" "}
                              {book.num_of_copies}{" "}
                              {book.num_of_copies === 1 ? "copy" : "copies"}
                            </span>
                            {book.num_of_holds > book.num_of_copies && (
                              <span className="text-amber-600 font-medium text-xs bg-amber-50 px-2 py-0.5 rounded-full">
                                High demand
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="lg:ml-6">
                          {renewalStatus.canRenew ? (
                            <button
                              onClick={() => renew(book.id)}
                              className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                            >
                              <svg
                                className="w-4 h-4 group-hover:animate-spin"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                              Renew
                            </button>
                          ) : (
                            <div className="w-full lg:w-auto bg-slate-100 text-slate-500 font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
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
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                              Cannot Renew
                            </div>
                          )}
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No books checked out
              </h3>
              <p className="text-slate-600 mb-6">
                When you borrow books from the library, they will appear here
                for easy tracking.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer">
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

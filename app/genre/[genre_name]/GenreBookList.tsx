"use client";

import React, { useEffect, useState } from "react";
import { Book, UserCheckedOut, UserOnHold } from "@/app/types";
import Image from "next/image";
import { User, Calendar, BookOpen, Clock, Heart, Users } from "lucide-react";

export default function GenreBookList({
  initialBooks,
}: {
  initialBooks: Book[];
}) {
  // Fake login check
  const isLoggedIn = true; // set to false to simulate not logged in
  const token = isLoggedIn ? "faketoken123" : null;

  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [userHold, setUserHold] = useState<string[]>([]);
  const [userForLater, setUserForLater] = useState<string[]>([]);
  const [userCheckedOut, setUserCheckedOut] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(!!token);

  const genreName = decodeURIComponent(
    typeof window !== "undefined"
      ? window.location.pathname.split("/genre/")[1]?.split("/")[0] || ""
      : ""
  );

  useEffect(() => {
    // If logged in, fetch for_later books for the user
    if (token) {
      setLoading(true);

      fetch("http://localhost:3000/api/user_data")
        .then((res) => (res.ok ? res.json() : null))
        .then((user) => {
          if (user) {
            // Set userCheckedOut to the ids of the books in the checked_out shelf
            setUserCheckedOut(
              user.checked_out.map((item: UserCheckedOut) => item.id)
            );
            setUserForLater(user.for_later);
            setUserHold(user.on_hold.map((item: UserOnHold) => item.id));
          } else {
            setUserCheckedOut([]);
          }
        })
        .catch(() => {
          setUserCheckedOut([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setUserForLater([]);
      setUserHold([]);
      setLoading(false);
    }
  }, [token]);

  const hold = async (bookId: string) => {
    const isInHold = userHold.includes(bookId);
    const method = isInHold ? "DELETE" : "PUT";

    try {
      const response = await fetch(`http://localhost:3000/api/hold/${bookId}`, {
        method,
        headers: {
          Authorization: "Bearer faketoken123",
        },
      });
      if (response.ok) {
        // Get updated user data from response
        const updatedUser = await response.json();

        // Update userHold state
        if (updatedUser.on_hold) {
          setUserHold(updatedUser.on_hold.map((item: UserOnHold) => item.id));
        }

        // Update userCheckedOut state
        if (updatedUser.checked_out) {
          setUserCheckedOut(
            updatedUser.checked_out.map((item: UserCheckedOut) => item.id)
          );
        }

        // Update the books state
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === bookId
              ? {
                  ...book,
                  num_of_holds: isInHold
                    ? book.num_of_holds - 1
                    : book.num_of_holds + 1,
                }
              : book
          )
        );
      } else {
        alert("Failed to update hold");
      }
    } catch (error) {
      console.error("Error updating hold:", error);
      alert("Failed to update hold");
    }
  };

  const forLater = async (bookId: string) => {
    const isInForLater = userForLater.includes(bookId);
    const method = isInForLater ? "DELETE" : "PUT";

    try {
      const response = await fetch(
        `http://localhost:3000/api/for_later/${bookId}`,
        {
          method,
        }
      );
      if (response.ok) {
        // Get updated user data from response
        const updatedUser = await response.json();

        // Update userForLater state
        if (isInForLater) {
          setUserForLater(
            updatedUser.for_later.filter((id: string) => id !== bookId)
          );
        } else {
          setUserForLater([...userForLater, bookId]);
        }
      } else {
        alert("Failed to update shelf");
      }
    } catch (error) {
      console.error("Error updating shelf:", error);
      alert("Failed to update shelf");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-slate-200 rounded-lg w-64 mb-4 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-96 animate-pulse"></div>
          </div>

          {/* Loading Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="aspect-[3/4] bg-slate-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-slate-200 rounded mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded mb-4 w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-8 bg-slate-200 rounded"></div>
                    <div className="h-8 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading Message */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 text-slate-600">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium">Loading books...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            {genreName}
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Discover amazing books in the {genreName.toLowerCase()} genre
          </p>
        </div>

        {/* Books Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book: Book) => {
              const isAvailable = book.num_of_holds < book.num_of_copies;
              const isCheckedOut = userCheckedOut.includes(book.id);
              const hasHold = userHold.includes(book.id);
              const isForLater = userForLater.includes(book.id);

              return (
                <article
                  key={book.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-200 flex flex-col"
                >
                  {/* Book Cover */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                    <Image
                      src={book.book_cover || "/placeholder.svg"}
                      alt={`${book.title} cover`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Status Indicators */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {isCheckedOut && (
                        <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Checked Out
                        </div>
                      )}
                      {hasHold && (
                        <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                          On Hold
                        </div>
                      )}
                      {isForLater && (
                        <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-current" />
                          Saved
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="font-bold text-lg text-slate-800 mb-3 line-clamp-2">
                      {book.title}
                    </h2>

                    {/* Book Info */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{book.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{book.published_date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {isAvailable ? "Available now" : "All copies in use"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {book.num_of_holds}{" "}
                          {book.num_of_holds === 1 ? "hold" : "holds"} on{" "}
                          {book.num_of_copies}{" "}
                          {book.num_of_copies === 1 ? "copy" : "copies"}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1"></div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {/* Primary Action */}
                      <div>
                        {isCheckedOut ? (
                          <button
                            onClick={() => alert("Already checked out")}
                            disabled
                            className="w-full bg-slate-100 text-slate-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <Clock className="w-4 h-4" />
                            Checked Out
                          </button>
                        ) : hasHold ? (
                          <button
                            onClick={() => hold(book.id)}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Users className="w-4 h-4" />
                            Cancel Hold
                          </button>
                        ) : (
                          <button
                            onClick={() => hold(book.id)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Users className="w-4 h-4" />
                            Place Hold
                          </button>
                        )}
                      </div>

                      {/* Secondary Action */}
                      <button
                        onClick={() => forLater(book.id)}
                        className={`w-full font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                          isForLater
                            ? "bg-red-50 hover:bg-red-100 text-red-600"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isForLater ? "fill-current" : ""
                          }`}
                        />
                        {isForLater ? "Remove From Shelf" : "Save For Later"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No books found
              </h3>
              <p className="text-slate-600 mb-6">
                We couldn&apos;t find any books in this genre. Try browsing
                other categories.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors cursor-pointer">
                Browse All Genres
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Book, UserCheckedOut, UserOnHold } from "@/app/types";
import Image from "next/image";
import { Calendar, User, BookOpen, Clock } from "lucide-react";

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

  useEffect(() => {
    // If logged in, fetch for_later books for the user
    if (token) {
      setLoading(true);

      fetch("http://localhost:3000/api/user_status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((user) => {
          if (user) {
            console.log("User data:", user);
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
          headers: {
            Authorization: "Bearer faketoken123",
          },
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <svg
            className="animate-spin h-20 w-20 text-amber-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span className="text-amber-400 font-medium text-2xl pt-5">
            Loading books...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {books.map((book: Book) => {
        const isAvailable = book.num_of_holds < book.num_of_copies;
        const isCheckedOut = userCheckedOut.includes(book.id);
        const hasHold = userHold.includes(book.id);
        const isForLater = userForLater.includes(book.id);

        return (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-md shadow-gray-400 overflow-hidden border border-slate-300 flex flex-col" // <-- add flex flex-col here
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

            <div className="p-4 flex-1 flex flex-col">
              <h2 className="font-bold text-lg mb-2 line-clamp-2 leading-tight text-gray-900">
                {book.title}
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="truncate">{book.author}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{book.published_date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 " />
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isAvailable ? "Available" : "All copies in use"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500">
                    {book.num_of_holds} holds on {book.num_of_copies} copies
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 flex flex-col gap-2">
              <div className="flex gap-2 w-full">
                {isCheckedOut ? (
                  <button
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm font-medium text-gray-500 cursor-not-allowed"
                    onClick={() => alert("Already checked out")}
                    disabled
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Checked Out
                  </button>
                ) : hasHold ? (
                  <button
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                    onClick={() => hold(book.id)}
                  >
                    Cancel Hold
                  </button>
                ) : (
                  <button
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 cursor-pointer"
                    onClick={() => hold(book.id)}
                  >
                    Place Hold
                  </button>
                )}
              </div>
              <button
                className={`w-full inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors  cursor-pointer ${
                  isForLater
                    ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100 focus:outline-none"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none"
                }`}
                onClick={() => forLater(book.id)}
              >
                {isForLater ? "Remove From Shelf" : "Save For Later"}
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}

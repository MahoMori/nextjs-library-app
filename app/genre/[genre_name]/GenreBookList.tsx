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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {books.map((book: Book) => {
        const isAvailable = book.num_of_holds < book.num_of_copies;
        const isCheckedOut = userCheckedOut.includes(book.id);
        const hasHold = userHold.includes(book.id);
        const isForLater = userForLater.includes(book.id);

        return (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="aspect-[3/4] relative bg-gray-100">
              <Image
                src={book.book_cover || "/placeholder.svg"}
                alt={`${book.title} cover`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute top-2 right-2">
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
            </div>

            <div className="p-4">
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
                  <BookOpen className="w-4 h-4" />
                  <span>
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
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    onClick={() => hold(book.id)}
                  >
                    Cancel Hold
                  </button>
                ) : (
                  <button
                    className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                      isAvailable
                        ? "bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={() => hold(book.id)}
                    disabled={!isAvailable}
                  >
                    Place Hold
                  </button>
                )}
              </div>

              <button
                className={`w-full inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors ${
                  isForLater
                    ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
                onClick={() => forLater(book.id)}
              >
                {isForLater ? "Remove From Shelf" : "Save For Later"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

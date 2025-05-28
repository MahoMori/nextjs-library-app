"use client";

import React, { useEffect, useState } from "react";
import { Book, UserCheckedOut, UserOnHold } from "@/app/types";
import Image from "next/image";

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
    <>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-lg text-gray-400">Loading...</span>
        </div>
      ) : (
        books.map((book: Book) => (
          <div key={book.id} className="p-4 border rounded-md mb-4">
            <h2 className="text-xl font-bold">{book.title}</h2>
            <p className="text-gray-100">Author: {book.author}</p>
            <p className="text-gray-100">Published: {book.published_date}</p>
            <p className="text-gray-100">
              {book.num_of_holds >= book.num_of_copies
                ? "All copies in use"
                : "Available"}
            </p>
            <p className="text-gray-100">
              Holds: {book.num_of_holds} on {book.num_of_copies} copies
            </p>
            <Image
              src={book.book_cover}
              alt={`${book.title} cover`}
              width={150}
              height={200}
              className="mt-2"
            />
            <div className="space-x-1">
              {userCheckedOut.includes(book.id) ? (
                <button
                  className="rounded-sm bg-green-400"
                  onClick={() => alert("Already checked out")}
                >
                  Already checked out
                </button>
              ) : userHold.includes(book.id) ? (
                <button
                  className="cursor-pointer rounded-sm bg-blue-400"
                  onClick={() => hold(book.id)}
                >
                  Cancel hold
                </button>
              ) : (
                <button
                  className="cursor-pointer rounded-sm bg-blue-400"
                  onClick={() => hold(book.id)}
                >
                  Place hold
                </button>
              )}

              {userForLater.includes(book.id) ? (
                <button
                  className="cursor-pointer rounded-sm bg-red-400"
                  onClick={() => forLater(book.id)}
                >
                  Remove From Shelf
                </button>
              ) : (
                <button
                  className="cursor-pointer rounded-sm bg-red-400"
                  onClick={() => forLater(book.id)}
                >
                  For later
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </>
  );
}

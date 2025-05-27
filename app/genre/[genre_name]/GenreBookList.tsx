"use client";

import React, { useEffect, useState } from "react";
import { Book } from "@/app/book-data";
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
  const [loading, setLoading] = useState<boolean>(!!token);

  useEffect(() => {
    // If logged in, fetch for_later books for the user
    if (token) {
      setLoading(true);
      fetch("http://localhost:3000/api/for_later", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((forLaterBooks: Book[]) => {
          console.log("For later books:", forLaterBooks);
          // Set userForLater to the ids of the books in the for_later shelf
          setUserForLater(forLaterBooks.map((book) => book.id));
        })
        .catch(() => {
          setUserForLater([]);
        })
        .finally(() => setLoading(false));
    } else {
      setUserForLater([]);
      setLoading(false);
    }
  }, [token]);

  const hold = (bookId: string) => {
    if (!userHold.includes(bookId)) {
      userHold.push(bookId);
    } else {
      const index = userHold.indexOf(bookId);
      if (index > -1) {
        userHold.splice(index, 1);
      }
    }
    setUserHold([...userHold]);

    // Update the book data to reflect the hold status
    books.find((book) => book.id === bookId)!.num_of_holds += userHold.includes(
      bookId
    )
      ? 1
      : -1;
  };

  const forLater = async (bookId: string) => {
    const isInForLater = userForLater.includes(bookId);
    const method = isInForLater ? "DELETE" : "PUT";
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
      if (isInForLater) {
        setUserForLater(userForLater.filter((id) => id !== bookId));
      } else {
        setUserForLater([...userForLater, bookId]);
      }
    } else {
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
              Borrowed: {book.is_borrowed ? "yes" : "no"}
            </p>
            <p className="text-gray-100">
              Hold: {book.num_of_holds} / {book.num_of_copies}
            </p>
            <Image
              src={book.book_cover}
              alt={`${book.title} cover`}
              width={150}
              height={200}
              className="mt-2"
            />
            <div className="space-x-1">
              {userHold.includes(book.id) ? (
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

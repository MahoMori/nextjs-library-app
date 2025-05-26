"use client";
import { books, Book } from "@/app/book-data";
import Image from "next/image";
import React, { useState } from "react";

export default function GenrePage({
  params,
}: {
  params: Promise<{ genre_name: string }>;
}) {
  const { genre_name } = React.use(params); // Unwrap the params promise
  const genre = genre_name.replace("%20", " ");
  const [userHold, setUserHold] = useState<number[]>([]);
  const [userForLater, setUserForLater] = useState<number[]>([]);

  const hold = (bookId: number) => {
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

  const forLater = (bookId: number) => {
    if (!userForLater.includes(bookId)) {
      userForLater.push(bookId);
    } else {
      const index = userForLater.indexOf(bookId);
      if (index > -1) {
        userForLater.splice(index, 1);
      }
    }
    setUserForLater([...userForLater]);
  };

  return (
    <div>
      {books.map((book: Book) => {
        if (book.genre === genre) {
          return (
            <div key={book.id} className="p-4 border rounded-md mb-4">
              <h2 className="text-xl font-bold">{book.title}</h2>
              <p className="text-gray-100">Author: {book.author}</p>
              {/* <p className="text-gray-600">Genre: {book.genre}</p> */}
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
          );
        }
        return null;
      })}
    </div>
  );
}

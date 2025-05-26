import { books, Book } from "@/app/book-data";
import Image from "next/image";

export default function GenrePage({
  params,
}: {
  params: { genre_name: string };
}) {
  const genre = params.genre_name.replace("%20", " ");

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
                <button className="cursor-pointer rounded-sm bg-green-500">
                  Borrow
                </button>
                <button className="cursor-pointer rounded-sm bg-blue-400">
                  Place hold
                </button>
                <button className="cursor-pointer rounded-sm bg-red-400">
                  For later
                </button>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

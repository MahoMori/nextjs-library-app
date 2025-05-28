import { Book } from "@/app/types";
import ForLaterList from "./ForLaterList";
import Link from "next/link";

export default async function ForLaterPage() {
  try {
    const response = await fetch("http://localhost:3000/api/for_later", {
      cache: "no-cache",
      headers: {
        Authorization: "Bearer faketoken123", // fake JWT for testing
      },
    });

    if (response.status === 404) {
      return <div>No user found</div>;
    }
    if (!response.ok) {
      return <div>Failed to load books</div>;
    }

    const forLaterBooks: Book[] = await response.json();

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
          </div>

          {/* Books List */}
          {forLaterBooks.length > 0 ? (
            <ForLaterList initialForLaterBooks={forLaterBooks} />
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
  } catch (error) {
    return <div>Something went wrong.</div>;
  }
}

import Link from "next/link";

const genres: string[] = [
  "Fiction",
  "Fantasy",
  "Science Fiction",
  "Non-Fiction",
  "Mystery",
  "Historical",
];

// Color mapping for each genre
const genreColors = [
  "bg-rose-500",
  "bg-amber-400",
  "bg-teal-600",
  "bg-rose-500",
  "bg-amber-400",
  "bg-teal-600",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="p-6 flex justify-center items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to the Library App!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Choose a genre you wish to browse.
          </p>
        </div>
      </header>

      <main className="px-6 pb-12 pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto justify-center">
          {genres.map((genre: string, index: number) => (
            <Link key={genre} href={`/genre/${genre}`} className="group">
              <div
                className={`
                aspect-video rounded-lg p-6 flex items-center justify-center
                ${genreColors[index] || "bg-gray-500 dark:bg-gray-600"}
                hover:scale-105 transform transition-all duration-300 ease-in-out
                shadow-lg hover:shadow-xl
                cursor-pointer
              `}
              >
                <h2 className="text-white font-semibold text-2xl text-center leading-tight">
                  {genre}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

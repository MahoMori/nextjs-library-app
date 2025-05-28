import Link from "next/link";

const genres: string[] = [
  "Fiction",
  "Fantasy",
  "Science Fiction",
  "Non-Fiction",
  "Mystery",
  "Historical",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Welcome to the Library App!
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose a genre you wish to browse.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map((genre: string) => (
            <Link key={genre} href={`/genre/${genre}`} className="block">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 h-full border border-slate-200 hover:border-slate-300">
                <h2 className="text-xl font-semibold text-slate-800 text-center">
                  {genre}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

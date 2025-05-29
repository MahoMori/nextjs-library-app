import Link from "next/link";

const genres = [
  {
    name: "Fiction",
    description: "Stories from the imagination",
    icon: "📚",
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
  },
  {
    name: "Fantasy",
    description: "Magical worlds and adventures",
    icon: "🧙‍♂️",
    color: "from-emerald-400 to-emerald-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
  {
    name: "Science Fiction",
    description: "Future worlds and technology",
    icon: "🚀",
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    name: "Non-Fiction",
    description: "Real stories and knowledge",
    icon: "📖",
    color: "from-amber-400 to-amber-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
  },
  {
    name: "Mystery",
    description: "Puzzles and suspenseful tales",
    icon: "🔍",
    color: "from-slate-400 to-slate-600",
    bgColor: "bg-slate-50",
    textColor: "text-slate-700",
  },
  {
    name: "Historical",
    description: "Stories from the past",
    icon: "🏛️",
    color: "from-rose-400 to-rose-600",
    bgColor: "bg-rose-50",
    textColor: "text-rose-700",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
              Welcome to the{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Library App
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
              Discover your next great read. Choose a genre below to explore our
              vast collection of books.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-slate-500">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">Over 10,000 books available</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
              <div className="flex items-center gap-2 text-slate-500">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">24/7 digital access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Genre Selection */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 my-4 mt-7">
            Browse by Genre
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From thrilling mysteries to epic fantasies, find the perfect book
            for your mood.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map((genre) => (
            <Link
              key={genre.name}
              href={`/genre/${genre.name}`}
              className="group block transform transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 h-full">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                {/* Content */}
                <div className="relative p-8">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 ${genre.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-3xl">{genre.icon}</span>
                  </div>

                  {/* Text Content */}
                  <h3 className={`text-2xl font-bold mb-3 ${genre.textColor}`}>
                    {genre.name}
                  </h3>

                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {genre.description}
                  </p>

                  {/* Call to Action */}
                  <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-700 transition-colors duration-300">
                    <span className="text-sm font-medium">Explore books</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div
                  className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${genre.color} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`}
                ></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
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
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Advanced Search
            </h3>
            <p className="text-sm text-slate-600">
              Find exactly what you&apos;re looking for with our powerful search
              filters.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
            <h3 className="font-semibold text-slate-800 mb-2">
              Personal Library
            </h3>
            <p className="text-sm text-slate-600">
              Keep track of your reading progress and create custom reading
              lists.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Quick Reservations
            </h3>
            <p className="text-sm text-slate-600">
              Reserve books instantly and get notified when they&apos;re
              available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

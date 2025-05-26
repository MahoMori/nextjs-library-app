import { genres } from "./book-data";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        choose genre:
        <div>
          {genres.map((genre: string) => (
            <Link
              key={genre}
              href={`/genre/${genre}`}
              className="cursor-pointer inline-block px-4 py-2 rounded-md text-gray-900 bg-gray-200 hover:bg-gray-300 transition-colors mr-2 mb-2"
            >
              {genre}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

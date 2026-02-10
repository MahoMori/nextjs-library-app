import GenreBookList from "./GenreBookList";

export default async function GenrePage({
  params,
}: {
  params: Promise<{ genre_name: string }>;
}) {
  let books = [];
  const { genre_name } = await params;
  const fetchUrl =
    process.env.NODE_ENV === "production"
      ? "https://nextjs-library-app-p87v.vercel.app"
      : "http://localhost:3000";
  const response = await fetch(`${fetchUrl}/api/genre/${genre_name}`, {
    method: "GET",
  });
  if (response.ok) {
    books = await response.json();
  } else {
    console.error("Failed to fetch books", {
      status: response.status,
      statusText: response.statusText,
    });
  }

  return <GenreBookList initialBooks={books} />;
}

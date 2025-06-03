import GenreBookList from "./GenreBookList";

export default async function GenrePage({
  params,
}: {
  params: Promise<{ genre_name: string }>;
}) {
  let books = [];
  const fetchUrl =
    process.env.NODE_ENV === "production"
      ? "https://nextjs-library-app-p87v.vercel.app"
      : "http://localhost:3000";
  const response = await fetch(
    `${fetchUrl}/api/genre/${(await params).genre_name}`,
    { method: "GET" }
  );
  if (response.ok) {
    books = await response.json();
  } else {
    alert("Failed to fetch books");
  }

  return <GenreBookList initialBooks={books} />;
}

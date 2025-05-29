import GenreBookList from "./GenreBookList";

export default async function GenrePage({
  params,
}: {
  params: Promise<{ genre_name: string }>;
}) {
  let books = [];
  const response = await fetch(
    `http://localhost:3000/api/genre/${(await params).genre_name}`
  );
  if (response.ok) {
    books = await response.json();
  } else {
    alert("Failed to fetch books");
  }

  return <GenreBookList initialBooks={books} />;
}

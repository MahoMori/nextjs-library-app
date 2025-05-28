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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-10 max-w-6xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100">
      <GenreBookList initialBooks={books} />
    </div>
  );
}

import GenreBookList from "./GenreBookList";
import { headers } from "next/headers";

export default async function GenrePage({
  params,
}: {
  params: Promise<{ genre_name: string }>;
}) {
  let books = [];
  const { genre_name } = await params;
  const headersList = headers();
  const host =
    (await headersList).get("x-forwarded-host") ??
    (await headersList).get("host");
  const protocol = (await headersList).get("x-forwarded-proto") ?? "http";
  const baseUrl = host
    ? `${protocol}://${host}`
    : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

  const response = await fetch(`${baseUrl}/api/genre/${genre_name}`, {
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

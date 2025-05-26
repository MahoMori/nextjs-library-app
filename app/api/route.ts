import { books } from "@/app/book-data";

// This API route checks which book_cover URLs are broken
export async function GET() {
  const brokenCovers: { id: number; title: string; book_cover: string }[] = [];

  // Use fetch to check each book_cover URL
  for (const book of books) {
    try {
      const res = await fetch(book.book_cover, { method: "HEAD" });
      if (!res.ok) {
        brokenCovers.push({
          id: book.id,
          title: book.title,
          book_cover: book.book_cover,
        });
      }
    } catch {
      brokenCovers.push({
        id: book.id,
        title: book.title,
        book_cover: book.book_cover,
      });
    }
  }

  return Response.json({ brokenCovers });
}

import { NextRequest } from "next/server";
import { connectToDb } from "@/app/api/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ genre_name: string }> }
) {
  const { db } = await connectToDb();

  const genre = await params.then((p) => p.genre_name);

  const books = await db.collection("books").find({ genre: genre }).toArray();

  if (!books) {
    return new Response("Books not found!", {
      status: 404,
    });
  }

  return new Response(JSON.stringify(books), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

import { connectToDb } from "@/app/api/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const { db } = await connectToDb();

  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const token = tokenCookie?.value;

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  let uid: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      uid: string;
    };
    uid = decoded.uid;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return new Response("Invalid token", { status: 401 });
  }

  const user = await db.collection("users").findOne({ uid });

  if (!user) {
    return new Response("User not found!", { status: 404 });
  }

  if (!user.on_hold || user.on_hold.length === 0) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Step 1: Extract book IDs and create a map for usernum_in_line
  const holdMap = new Map<string, number>();
  const bookIds = user.on_hold.map(
    (hold: { id: string; usernum_in_line: number }) => {
      holdMap.set(hold.id, hold.usernum_in_line);
      return hold.id;
    }
  );

  // Step 2: Query books by IDs
  const books = await db
    .collection("books")
    .find({ id: { $in: bookIds } })
    .toArray();

  // Step 3: Attach usernum_in_line to each book
  const booksWithLine = books.map((book) => ({
    ...book,
    usernum_in_line: holdMap.get(book.id) ?? null,
  }));

  return new Response(JSON.stringify(booksWithLine), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

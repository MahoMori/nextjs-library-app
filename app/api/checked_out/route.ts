import { connectToDb } from "@/app/api/db";
import { UserCheckedOut } from "@/app/types";
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

  if (!user.checked_out || user.checked_out.length === 0) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Step 1: Extract book IDs and create a map for remaining_days and renew_count
  const checkedOutMap = new Map<
    string,
    { remaining_days: number; renew_count: number }
  >();
  const bookIds = user.checked_out.map((checked_out: UserCheckedOut) => {
    checkedOutMap.set(checked_out.id, {
      remaining_days: checked_out.remaining_days,
      renew_count: checked_out.renew_count,
    });
    return checked_out.id;
  });

  // Step 2: Query books by IDs
  const books = await db
    .collection("books")
    .find({ id: { $in: bookIds } })
    .toArray();

  // Step 3: Attach remaining_days and renew_count to each book
  const booksWithAdditionalInfo = books.map((book) => {
    const checkedOut = checkedOutMap.get(book.id);
    return {
      ...book,
      remaining_days: checkedOut ? checkedOut.remaining_days : null,
      renew_count: checkedOut ? checkedOut.renew_count : null,
    };
  });

  return new Response(JSON.stringify(booksWithAdditionalInfo), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

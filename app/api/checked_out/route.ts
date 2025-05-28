import { NextRequest } from "next/server";
import { connectToDb } from "@/app/api/db";
import { UserCheckedOut } from "@/app/types";

export async function GET(request: NextRequest) {
  const { db } = await connectToDb();

  // Get the Authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  // For now, fake extracting uid from the token
  // In real JWT, you'd decode and verify the token
  let uid: string;
  if (authHeader === "Bearer faketoken123") {
    uid = "1"; // hardcoded test user id
  } else {
    return new Response("Invalid token", { status: 401 });
  }

  const user = await db.collection("users").findOne({ uid });

  if (!user) {
    return new Response("User not found!", { status: 404 });
  }

  console.log("User found:", user);

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

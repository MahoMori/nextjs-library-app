import { NextRequest } from "next/server";
import { connectToDb } from "@/app/api/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// PUT: hold a book or check it out
export async function PUT(
  request: NextRequest,
  { params }: { params: { book_id: string } }
) {
  const { db } = await connectToDb();

  const cookieStore = cookies();
  const token = (await cookieStore).get("token");

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  let uid: string;
  try {
    const decoded = jwt.verify(
      token.value,
      process.env.JWT_SECRET as string
    ) as { uid: string };
    uid = decoded.uid;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return new Response("Invalid token", { status: 401 });
  }

  const user = await db.collection("users").findOne({ uid });

  if (!user) {
    return new Response("User not found!", {
      status: 404,
    });
  }

  params = await params;
  const bookId = await params.book_id;

  // Check if the book exists
  const book = await db.collection("books").findOne({ id: bookId });
  if (!book) {
    return new Response("Book not found!", { status: 404 });
  }

  const num_of_holds = book.num_of_holds;
  const num_of_copies = book.num_of_copies;

  // Increment num_of_holds
  await db
    .collection("books")
    .updateOne({ id: bookId }, { $inc: { num_of_holds: 1 } });

  if (num_of_holds < num_of_copies) {
    // Add to checked_out
    await db.collection("users").updateOne(
      { uid },
      {
        $addToSet: {
          checked_out: {
            id: book.id,
            remaining_days: 21,
            renew_count: 0,
          },
        } as never,
      }
    );
  } else {
    // Add to on_hold
    await db.collection("users").updateOne(
      { uid },
      {
        $addToSet: {
          on_hold: {
            id: book.id,
            usernum_in_line: num_of_holds + 1,
          },
        } as never,
      }
    );
  }

  // Fetch updated user data
  const updatedUser = await db.collection("users").findOne({ uid });

  return new Response(JSON.stringify(updatedUser), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// DELETE: cancel hold
export async function DELETE(
  request: NextRequest,
  { params }: { params: { book_id: string } }
) {
  const { db } = await connectToDb();

  const cookieStore = cookies();
  const token = (await cookieStore).get("token");

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  let uid: string;
  try {
    const decoded = jwt.verify(
      token.value,
      process.env.JWT_SECRET as string
    ) as { uid: string };
    uid = decoded.uid;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return new Response("Invalid token", { status: 401 });
  }

  const user = await db.collection("users").findOne({ uid });

  if (!user) {
    return new Response("User not found!", {
      status: 404,
    });
  }

  // Remove book from user's on_hold array
  const bookId = params.book_id;
  await db
    .collection("users")
    .updateOne({ uid }, { $pull: { on_hold: { id: bookId } } } as never);

  // Decrement num_of_holds for the book
  await db
    .collection("books")
    .updateOne({ id: bookId }, { $inc: { num_of_holds: -1 } });

  // Fetch updated user
  const updatedUser = await db.collection("users").findOne({ uid });

  return new Response(JSON.stringify(updatedUser), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

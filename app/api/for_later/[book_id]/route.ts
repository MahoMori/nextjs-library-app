import { NextRequest } from "next/server";
import { connectToDb } from "@/app/api/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ book_id: string }> }
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

  const bookId = await params.then((p) => p.book_id);

  // Add book_id to user's for_later array
  await db
    .collection("users")
    .updateOne({ uid }, { $addToSet: { for_later: bookId } as never });

  // Fetch updated user
  const updatedUser = await db.collection("users").findOne({ uid });

  return new Response(JSON.stringify(updatedUser), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ book_id: string }> }
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

  // Remove book_id from user's for_later array
  const bookId = await params.then((p) => p.book_id);
  await db
    .collection("users")
    .updateOne({ uid }, { $pull: { for_later: bookId } as never });

  // Fetch updated user
  const updatedUser = await db.collection("users").findOne({ uid });

  return new Response(JSON.stringify(updatedUser), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

import { NextRequest } from "next/server";
import { connectToDb } from "@/app/api/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { book_id: string } }
) {
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
    return new Response("User not found!", {
      status: 404,
    });
  }

  params = await params;
  const bookId = await params.book_id;

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
  { params }: { params: { book_id: string } }
) {
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
    return new Response("User not found!", {
      status: 404,
    });
  }

  // Remove book_id from user's for_later array
  const bookId = params.book_id;
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

import { NextRequest } from "next/server";
import { connectToDb } from "@/app/api/db";

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

  const books = await db
    .collection("books")
    .find({ id: { $in: user.for_later } })
    .toArray();

  return new Response(JSON.stringify(books), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

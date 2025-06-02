import { NextRequest } from "next/server";
import { connectToDb } from "@/app/api/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// PUT: renew a checked out book
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

  await db.collection("users").updateOne(
    { uid, "checked_out.id": bookId },
    {
      $set: { "checked_out.$.remaining_days": 21 },
      $inc: { "checked_out.$.renew_count": 1 },
    }
  );

  // Fetch updated user data
  const updatedUser = await db.collection("users").findOne({ uid });

  return new Response(JSON.stringify(updatedUser), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

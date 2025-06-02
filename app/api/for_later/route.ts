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

  if (!user.for_later || user.for_later.length === 0) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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

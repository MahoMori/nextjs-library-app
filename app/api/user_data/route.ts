import { connectToDb } from "@/app/api/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
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
    return new Response("User not found!", { status: 404 });
  }

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

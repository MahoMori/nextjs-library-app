import { NextRequest } from "next/server";
import { connectToDb } from "@/app/api/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  const { db } = await connectToDb();
  const body = await request.json();
  const { email, password } = body;

  // Find user by email
  const user = await db.collection("users").findOne({ email });
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response("Password is incorrect", { status: 401 });
  }

  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ id: user._id, email: user.email }, secret!, {
    expiresIn: "1h",
  });

  const isProd = process.env.NODE_ENV === "production";

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; ${
        isProd ? " Secure;" : ""
      }`,
    },
  });
}

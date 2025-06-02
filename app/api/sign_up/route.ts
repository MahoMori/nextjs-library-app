import { NextRequest } from "next/server";
import { connectToDb } from "@/app/api/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { db } = await connectToDb();
  const body = await request.json();
  const { email, password, name } = body;

  // Validate input
  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email: email });
  if (existingUser) {
    return new Response("User already exists", { status: 409 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = {
    username: name || "Anonymous",
    email: email,
    password: hashedPassword,
    createdAt: new Date(),
  };

  const result = await db.collection("users").insertOne(newUser);

  if (result.acknowledged) {
    return new Response(JSON.stringify({ uid: result.insertedId }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    return new Response("Failed to create user", { status: 500 });
  }
}

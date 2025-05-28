import { NextRequest } from "next/server";
import { connectToDb } from "@/app/api/db";

// PUT: renew a checked out book
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

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token");

  if (!token) {
    return new Response(JSON.stringify({ authorized: false }), {
      status: 200,
    });
  }

  try {
    jwt.verify(token.value, process.env.JWT_SECRET as string) as {
      uid: string;
    };
    return new Response(JSON.stringify({ authorized: true }), {
      status: 200,
    });
  } catch (err) {
    console.error("JWT verification failed:", err);
    return new Response(JSON.stringify({ authorized: false }), {
      status: 200,
    });
  }
}

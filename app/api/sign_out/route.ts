import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  return new Response("Sign out successful", {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict;${
        isProd ? " Secure;" : ""
      }`,
    },
  });
}

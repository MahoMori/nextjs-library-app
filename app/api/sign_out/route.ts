export async function POST() {
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

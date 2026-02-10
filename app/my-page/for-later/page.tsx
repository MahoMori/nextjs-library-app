import { Book } from "@/app/types";
import ForLaterList from "./ForLaterList";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ForLaterPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const session = cookieStore.get("token");
  if (!session) {
    redirect(
      `/sign-in?callbackUrl=${encodeURIComponent("/my-page/for-later")}`,
    );
  }

  const headersList = headers();
  const host =
    (await headersList).get("x-forwarded-host") ??
    (await headersList).get("host");
  const protocol = (await headersList).get("x-forwarded-proto") ?? "http";
  const baseUrl = host
    ? `${protocol}://${host}`
    : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

  try {
    const response = await fetch(`${baseUrl}/api/for_later`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });

    // User is signed in but no user data found
    if (response.status === 404) {
      return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
          No user found
        </div>
      );
    }
    // Other errors
    if (!response.ok) {
      return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
          Failed to load books
        </div>
      );
    }

    const forLaterBooks: Book[] = await response.json();

    return <ForLaterList initialForLaterBooks={forLaterBooks} />;
  } catch (error) {
    console.error("Error fetching for later books:", error);
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        Something went wrong.
      </div>
    );
  }
}

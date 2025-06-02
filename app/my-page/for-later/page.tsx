import { Book } from "@/app/types";
import ForLaterList from "./ForLaterList";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ForLaterPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch("http://localhost:3000/api/for_later", {
      cache: "no-cache",
      headers: {
        Cookie: cookieHeader,
      },
    });

    // User is not signed in
    if (response.status === 401) {
      redirect("/sign-in");
    }
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

import { Book } from "@/app/types";
import CheckedOutList from "./CheckedOutList";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CheckedOutPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch("http://localhost:3000/api/checked_out", {
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

    const checkedOutBooks: Book[] = await response.json();

    return <CheckedOutList initialCheckedOutBooks={checkedOutBooks} />;
  } catch (error) {
    console.error("Error fetching checked out books:", error);
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        Something went wrong.
      </div>
    );
  }
}

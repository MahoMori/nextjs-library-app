import { Book } from "@/app/types";
import OnHoldList from "./OnHoldList";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function OnHoldPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const session = cookieStore.get("token");
  if (!session) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent("/my-page/on-hold")}`);
  }

  try {
    const response = await fetch("http://localhost:3000/api/hold", {
      cache: "no-cache",
      headers: {
        Cookie: cookieHeader,
      },
    });

    // User is not signe
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

    const onHoldBooks: Book[] = await response.json();

    return <OnHoldList initialOnHoldBooks={onHoldBooks} />;
  } catch (error) {
    console.error("Error fetching on hold books:", error);
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        Something went wrong.
      </div>
    );
  }
}

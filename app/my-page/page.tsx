import Link from "next/link";

export default function MyPage() {
  return (
    <div>
      <Link
        href={`/my-page/checked-out`}
        className="cursor-pointer inline-block px-4 py-2 rounded-md text-gray-900 bg-gray-200 hover:bg-gray-300 transition-colors mr-2 mb-2"
      >
        Checked Out
      </Link>
      <Link
        href={`/my-page/on-hold`}
        className="cursor-pointer inline-block px-4 py-2 rounded-md text-gray-900 bg-gray-200 hover:bg-gray-300 transition-colors mr-2 mb-2"
      >
        On Hold
      </Link>
      <Link
        href={`/my-page/for-later`}
        className="cursor-pointer inline-block px-4 py-2 rounded-md text-gray-900 bg-gray-200 hover:bg-gray-300 transition-colors mr-2 mb-2"
      >
        For Later
      </Link>
    </div>
  );
}

import Link from "next/link";

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            My Library
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Manage your book collection and reading status
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/my-page/checked-out"
            className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Checked Out
              </h3>
              <p className="text-slate-600 text-sm">Books currently borrowed</p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </Link>

          <Link
            href="/my-page/on-hold"
            className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                <svg
                  className="w-8 h-8 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                On Hold
              </h3>
              <p className="text-slate-600 text-sm">
                Reserved books waiting for you
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </Link>

          <Link
            href="/my-page/for-later"
            className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                For Later
              </h3>
              <p className="text-slate-600 text-sm">Your reading wishlist</p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </Link>
        </div>

        {/* Additional Info Section */}
        {/* <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              Quick Stats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                <div className="text-slate-600">Books Read This Year</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">3</div>
                <div className="text-slate-600">Currently Reading</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  25
                </div>
                <div className="text-slate-600">Books in Wishlist</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

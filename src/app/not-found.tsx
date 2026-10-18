import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f9f4] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-8 text-center shadow-sm">
        {/* Icon */}
        <div
          className="mb-5 text-7xl"
          role="img"
          aria-label="Page not found"
        >
          🔎
        </div>

        {/* Error Code */}
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-green-700">
          Error 404
        </p>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
          দুঃখিত! আপনি যে পেজটি খুঁজছেন, সেটি পাওয়া যায়নি। পেজটির ঠিকানা
          ভুল হতে পারে অথবা পেজটি সরিয়ে ফেলা হয়েছে।
        </p>

        {/* Home Button */}
        <Link
          href="/"
          className="mt-7 inline-flex items-center justify-center rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-[#f5f9f4] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">

        {/* Category Header Skeleton */}
        <div className="mb-8 flex items-center gap-5 rounded-2xl border border-green-100 bg-white p-6">
          <div className="h-20 w-20 shrink-0 rounded-2xl bg-green-100" />

          <div className="flex-1 space-y-3">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-7 w-48 max-w-full rounded bg-gray-200" />
            <div className="h-4 w-64 max-w-full rounded bg-gray-100" />
          </div>
        </div>

        {/* Title and Sort Skeleton */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-6 w-40 rounded bg-gray-200" />
            <div className="h-4 w-56 max-w-full rounded bg-gray-100" />
          </div>

          <div className="h-11 w-full rounded-lg bg-gray-200 sm:w-56" />
        </div>

        {/* Product Cards Skeleton */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-green-100 bg-white"
            >
              <div className="h-24 bg-green-100 sm:h-32" />

              <div className="space-y-3 p-3 sm:p-4">
                <div className="h-3 w-20 rounded bg-gray-200" />
                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/3 rounded bg-gray-100" />
                <div className="h-14 rounded-lg bg-green-50" />
                <div className="h-9 rounded-lg bg-gray-200" />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          পণ্য লোড হচ্ছে...
        </p>
      </div>
    </main>
  );
}
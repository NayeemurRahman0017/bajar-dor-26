
import { notFound } from "next/navigation";
import Link from "next/link";

import { getProducts } from "@/lib/products";
import { formatPrice, getUnitBn } from "@/lib/utils";
import { getProductEmoji } from "@/lib/productsEmojis";

export const instant = false;

interface ProductDetailsPageProps {
params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({
params,
}: ProductDetailsPageProps) {
const { slug } = await params;

// API থেকে সব পণ্য সংগ্রহ
const products = await getProducts();

// URL-এর slug অনুযায়ী পণ্য খোঁজা
const normalizedSlug = decodeURIComponent(slug).trim();

const product = products.find(
(item) => String(item.slug).trim() === normalizedSlug,
);

// পণ্য না পাওয়া গেলে 404
if (!product) {
notFound();
}

// বাজারের তথ্য
const markets = product.markets ?? [];

const prices = markets
.flatMap((market) => [
Number(market.min),
Number(market.max),
])
.filter((price) => Number.isFinite(price) && price > 0);

const minPrice =
prices.length > 0
? Math.min(...prices)
: product.today;

const maxPrice =
prices.length > 0
? Math.max(...prices)
: product.today;

const avgPrice =
prices.length > 0
? prices.reduce((sum, price) => sum + price, 0) /
prices.length
: product.today;

const isPriceUp = product.change?.dir === "up";
const isPriceDown = product.change?.dir === "down";
const isPriceFlat = product.change?.dir === "flat";

return ( <main className="min-h-screen bg-[#f5f9f4] px-4 py-8 sm:px-6 lg:px-8"> <div className="mx-auto max-w-5xl">


    {/* Back Button */}
    <Link
      href="/"
      className="mb-6 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-green-700 transition-colors hover:text-green-900"
    >
      <span aria-hidden="true">←</span>
      হোম পেজে ফিরে যান
    </Link>

    {/* Product Summary */}
    <section className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">

      {/* Product Header */}
      <div className="flex flex-col items-center gap-5 bg-linear-to-br from-green-50 via-lime-50 to-emerald-100 px-5 py-8 text-center sm:flex-row sm:px-8 sm:py-10 sm:text-left">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-green-100 bg-white/80 shadow-sm sm:h-36 sm:w-36">
          <span
            className="text-6xl sm:text-7xl"
            role="img"
            aria-label={product.nameBn}
          >
            {getProductEmoji(product.nameBn)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
            {product.categoryIcon} {product.categoryNameBn}
          </span>

          <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {product.nameBn}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            একক: {getUnitBn(product.unit)}
          </p>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            এই পণ্যের আজকের বাজারদর, দামের পরিবর্তন এবং
            বিভিন্ন বাজারের মূল্য এক নজরে দেখুন।
          </p>

          {/* Price Change */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            {isPriceUp && (
              <span className="rounded-full bg-green-100 px-3 py-1.5 text-sm font-bold text-green-700">
                ▲ {formatPrice(product.change.pct)}% দাম বেড়েছে
              </span>
            )}

            {isPriceDown && (
              <span className="rounded-full bg-red-100 px-3 py-1.5 text-sm font-bold text-red-700">
                ▼ {formatPrice(product.change.pct)}% দাম কমেছে
              </span>
            )}

            {isPriceFlat && (
              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-600">
                — ০.০% দাম অপরিবর্তিত
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Today's Price */}
      <div className="border-t border-green-100 p-5 sm:p-8">
        <p className="text-sm font-medium text-gray-500">
          আজকের বাজারদর
        </p>

        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-3xl font-extrabold text-green-800 sm:text-4xl">
            ৳{formatPrice(product.today)}
          </span>

          <span className="text-sm text-gray-500">
            {getUnitBn(product.unit)}
          </span>
        </div>

        {product.yesterday > 0 && (
          <p className="mt-3 text-sm text-gray-500">
            গতকালের দাম:{" "}
            <span className="font-semibold text-gray-700">
              ৳{formatPrice(product.yesterday)}
            </span>
          </p>
        )}
      </div>
    </section>

    {/* Price Summary */}
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          দামের সারসংক্ষেপ
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          বিভিন্ন বাজারের দামের তুলনা
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Minimum Price */}
        <div className="rounded-xl border border-green-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-2xl">
              ↓
            </div>

            <div>
              <p className="text-sm text-gray-500">
                সর্বনিম্ন দাম
              </p>

              <p className="mt-1 text-xl font-extrabold text-green-700 sm:text-2xl">
                ৳{formatPrice(minPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* Maximum Price */}
        <div className="rounded-xl border border-red-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-2xl">
              ↑
            </div>

            <div>
              <p className="text-sm text-gray-500">
                সর্বোচ্চ দাম
              </p>

              <p className="mt-1 text-xl font-extrabold text-red-600 sm:text-2xl">
                ৳{formatPrice(maxPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* Average Price */}
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-2xl">
              ৳
            </div>

            <div>
              <p className="text-sm text-gray-500">
                গড় দাম
              </p>

              <p className="mt-1 text-xl font-extrabold text-blue-700 sm:text-2xl">
                ৳{formatPrice(Math.round(avgPrice))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Market Prices */}
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          🏪 বাজারভিত্তিক আজকের দাম
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          বিভিন্ন বাজারে {product.nameBn}-এর বর্তমান মূল্য।
        </p>
      </div>

      {markets.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-green-100 bg-white shadow-sm">
          <div className="border-b border-green-100 bg-green-50 px-4 py-4 sm:px-6">
            <p className="font-semibold text-green-900">
              {product.nameBn} — বাজারের মূল্যতালিকা
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="whitespace-nowrap px-4 py-4 font-semibold sm:px-6">
                    বাজারের নাম
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 font-semibold sm:px-6">
                    বিভাগ
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 font-semibold sm:px-6">
                    সর্বনিম্ন দাম
                  </th>

                  <th className="whitespace-nowrap px-4 py-4 font-semibold sm:px-6">
                    সর্বোচ্চ দাম
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {markets.map((market, index) => (
                  <tr
                    key={`${market.market}-${index}`}
                    className="transition-colors hover:bg-green-50/70"
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-gray-900 sm:px-6">
                      {market.market}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-gray-600 sm:px-6">
                      {market.division}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                      <span className="rounded-md bg-green-50 px-2 py-1 font-bold text-green-700">
                        ৳{formatPrice(market.min)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                      <span className="rounded-md bg-red-50 px-2 py-1 font-bold text-red-600">
                        ৳{formatPrice(market.max)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <div className="text-4xl">🏪</div>

          <p className="mt-3 font-semibold text-gray-700">
            বাজারের তথ্য পাওয়া যায়নি
          </p>

          <p className="mt-1 text-sm text-gray-500">
            এই পণ্যের বাজারভিত্তিক দামের তথ্য বর্তমানে উপলব্ধ নেই।
          </p>
        </div>
      )}
    </section>


    {/* Back to Home */}
    <div className="mt-8 text-center">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800"
      >
        <span aria-hidden="true">←</span>
        সব পণ্য দেখুন
      </Link>
    </div>
  </div>
</main>


);
}

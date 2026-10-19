import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { getProducts } from "@/lib/products";
import { formatPrice, getUnitBn } from "@/lib/utils";

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

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-3 py-6 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[#667168] sm:text-sm"
        >
          <Link href="/" className="hover:text-green-700">
            হোম
          </Link>

          <span aria-hidden="true">›</span>

          <span>{product.categoryNameBn}</span>

          <span aria-hidden="true">›</span>

          <span className="font-medium text-[#29352c]">
            {product.nameBn}
          </span>
        </nav>

        {/* Product Summary Card */}
        <section className="rounded-2xl border border-[#e0e9e0] bg-[#fbfcfa] p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-5">
            {/* API Product Image */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0f5ef] sm:h-20 sm:w-20">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.nameBn}
                  width={80}
                  height={80}
                  unoptimized
                  className="h-full w-full object-contain p-1.5"
                />
              ) : (
                <span className="text-xs text-gray-400">
                  ছবি নেই
                </span>
              )}
            </div>

            {/* Product Information */}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold leading-snug text-[#263229] sm:text-2xl">
                {product.nameBn}
              </h1>

              <p className="mt-1 text-xs text-[#687269] sm:text-sm">
                {getUnitBn(product.unit)}
                {" · "}
                {product.categoryNameBn}
              </p>

              {product.yesterday > 0 && (
                <p className="mt-1 text-xs text-[#687269] sm:text-sm">
                  গতকালের তুলনায় আজ দাম
                  {" "}
                  {isPriceUp
                    ? "বেড়েছে"
                    : isPriceDown
                      ? "কমেছে"
                      : "অপরিবর্তিত"}
                  {" · "}
                  {formatPrice(product.yesterday)} টাকা
                </p>
              )}
            </div>

            {/* Today's Price */}
            <div className="shrink-0 rounded-xl bg-[#f0f5ef] px-3 py-3 text-center sm:px-5 sm:py-4">
              <p className="text-[10px] text-[#69756b] sm:text-xs">
                আজকের দাম
              </p>

              <p className="mt-1 text-xl font-extrabold leading-tight text-[#29352c] sm:text-3xl">
                {formatPrice(product.today)}
              </p>

              <p className="mt-1 text-[10px] text-[#69756b] sm:text-xs">
                টাকা / {getUnitBn(product.unit).replace("প্রতি ", "")}
              </p>

              <div
                className={`mt-1 text-[10px] font-bold sm:text-xs ${
                  isPriceUp
                    ? "text-red-600"
                    : isPriceDown
                      ? "text-green-700"
                      : "text-gray-500"
                }`}
              >
                {isPriceUp && (
                  <>▲ {formatPrice(product.change.pct)}%</>
                )}

                {isPriceDown && (
                  <>▼ {formatPrice(product.change.pct)}%</>
                )}

                {isPriceFlat && <>— ০.০%</>}
              </div>
            </div>
          </div>
        </section>

        {/* Price Summary */}
        <section className="mt-5 rounded-2xl border border-[#e0e9e0] bg-[#fbfcfa] p-4 sm:p-5">
          <h2 className="mb-3 text-base font-bold text-[#29352c] sm:text-lg">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {/* Minimum Price */}
            <div className="rounded-xl border border-[#e3ebe3] bg-[#fbfcfa] p-3 sm:p-4">
              <p className="text-[10px] text-[#657066] sm:text-sm">
                সর্বনিম্ন দাম
              </p>

              <p className="mt-1 text-base font-extrabold text-green-700 sm:text-2xl">
                {formatPrice(minPrice)} টাকা
              </p>

              <p className="mt-1 text-[9px] text-[#687269] sm:text-xs">
                বাজারের কম দামের বাজার
              </p>
            </div>

            {/* Maximum Price */}
            <div className="rounded-xl border border-[#e3ebe3] bg-[#fbfcfa] p-3 sm:p-4">
              <p className="text-[10px] text-[#657066] sm:text-sm">
                সর্বোচ্চ দাম
              </p>

              <p className="mt-1 text-base font-extrabold text-red-600 sm:text-2xl">
                {formatPrice(maxPrice)} টাকা
              </p>

              <p className="mt-1 text-[9px] text-[#687269] sm:text-xs">
                বাজারের বেশি দামের বাজার
              </p>
            </div>

            {/* Average Price */}
            <div className="rounded-xl border border-[#e3ebe3] bg-[#fbfcfa] p-3 sm:p-4">
              <p className="text-[10px] text-[#657066] sm:text-sm">
                গড় দাম
              </p>

              <p className="mt-1 text-base font-extrabold text-green-700 sm:text-2xl">
                {formatPrice(Math.round(avgPrice))} টাকা
              </p>

              <p className="mt-1 text-[9px] text-[#687269] sm:text-xs">
                প্রতি বাজারের গড় দাম
              </p>
            </div>
          </div>
        </section>

        {/* Market Prices Table */}
        <section className="mt-5 rounded-2xl border border-[#e0e9e0] bg-[#fbfcfa] p-4 sm:p-5">
          <h2 className="mb-3 text-base font-bold text-[#29352c] sm:text-lg">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {markets.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-[#e1e9e1]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#f8faf7] text-[#586359]">
                    <tr>
                      <th className="whitespace-nowrap px-3 py-3 font-semibold sm:px-4">
                        বাজার
                      </th>

                      <th className="whitespace-nowrap px-3 py-3 font-semibold sm:px-4">
                        বিভাগ
                      </th>

                      <th className="whitespace-nowrap px-3 py-3 text-right font-semibold sm:px-4">
                        সর্বনিম্ন
                      </th>

                      <th className="whitespace-nowrap px-3 py-3 text-right font-semibold sm:px-4">
                        সর্বোচ্চ
                      </th>

                      <th className="whitespace-nowrap px-3 py-3 text-right font-semibold sm:px-4">
                        গড়
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {markets.map((market, index) => {
                      const average =
                        (Number(market.min) + Number(market.max)) / 2;

                      return (
                        <tr
                          key={`${market.market}-${index}`}
                          className={`border-t border-[#e0e8e0] transition-colors hover:bg-[#eaf3ea] ${
                            index % 2 === 0
                              ? "bg-[#fbfcfa]"
                              : "bg-[#f0f6f0]"
                          }`}
                        >
                          <td className="whitespace-nowrap px-3 py-3 font-medium text-[#344036] sm:px-4">
                            {market.market}
                          </td>

                          <td className="whitespace-nowrap px-3 py-3 text-[#586359] sm:px-4">
                            {market.division}
                          </td>

                          <td className="whitespace-nowrap px-3 py-3 text-right text-[#344036] sm:px-4">
                            {formatPrice(market.min)} টাকা
                          </td>

                          <td className="whitespace-nowrap px-3 py-3 text-right text-[#344036] sm:px-4">
                            {formatPrice(market.max)} টাকা
                          </td>

                          <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-[#344036] sm:px-4">
                            {formatPrice(Math.round(average))} টাকা
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#d7e2d7] p-6 text-center">
              <p className="font-semibold text-[#586359]">
                বাজারের তথ্য পাওয়া যায়নি
              </p>

              <p className="mt-1 text-sm text-[#778078]">
                এই পণ্যের বাজারভিত্তিক দামের তথ্য বর্তমানে উপলব্ধ নেই।
              </p>
            </div>
          )}
        </section>

        {/* Back to Home */}
        <div className="mt-5 pb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-800 transition-colors hover:text-green-950"
          >
            <span aria-hidden="true">←</span>
            সব পণ্য দেখুন
          </Link>
        </div>
      </div>
    </main>
  );
}
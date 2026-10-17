import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, getUnitBn } from "@/lib/utils";
import { getProductEmoji } from "@/lib/productsEmojis";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isPriceUp = product.change.dir === "up";
  const isPriceDown = product.change.dir === "down";
  const isPriceFlat = product.change.dir === "flat";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-green-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
    >
      {/* Product Emoji */}
      <div className="flex h-24 items-center justify-center bg-linear-to-br from-green-50 via-lime-50 to-emerald-100 sm:h-32">
        <span
          className="text-5xl transition-transform duration-300 group-hover:scale-110 sm:text-6xl"
          role="img"
          aria-label={product.nameBn}
        >
          {getProductEmoji(product.nameBn)}
        </span>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-4">
        {/* Category */}
        <p className="truncate text-xs font-medium text-green-700 sm:text-sm">
          {product.categoryIcon} {product.categoryNameBn}
        </p>

        {/* Product Name */}
        <h3 className="mt-1 truncate text-sm font-bold text-gray-800 transition-colors group-hover:text-green-700 sm:text-base">
          {product.nameBn}
        </h3>

        {/* Unit */}
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          {getUnitBn(product.unit)}
        </p>

        {/* Today's Price */}
        <div className="mt-3 rounded-lg border border-green-100 bg-green-50 p-2 sm:p-3">
          <p className="text-[10px] text-green-700 sm:text-xs">
            আজকের বাজারদর
          </p>

          <p className="mt-1 text-base font-extrabold text-green-800 sm:text-xl">
            ৳{formatPrice(product.today)}
          </p>
        </div>

        {/* Price Change and Yesterday's Price */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] text-gray-500 sm:text-xs">
            গতকালের দাম
          </span>

          <span className="text-xs font-semibold text-gray-700 sm:text-sm">
            ৳{formatPrice(product.yesterday)}
          </span>
        </div>

        {/* Price Change Badge */}
        <div className="mt-2">
          {isPriceUp && (
            <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
              ▲ {formatPrice(product.change.pct)}%
            </span>
          )}

          {isPriceDown && (
            <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
              ▼ {formatPrice(product.change.pct)}%
            </span>
          )}

          {isPriceFlat && (
            <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
              —০.০%
            </span>
          )}
        </div>

        {/* Details Button */}
        <div className="mt-3 flex items-center justify-between rounded-lg bg-green-700 px-3 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-green-800 sm:text-sm">
          <span>বিস্তারিত দেখুন</span>
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  );
}
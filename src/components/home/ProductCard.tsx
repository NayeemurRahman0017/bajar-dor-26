import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, getUnitBn } from "@/lib/utils";

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
      className="group block h-34.5 w-full overflow-hidden rounded-[20px] border border-[#dfe7df] bg-[#a4a2bc6b] p-3 transition-all duration-300 hover:border-green-300 hover:shadow-md sm:p-4"
    >
      <div className="flex items-center gap-5">
        {/* Product Image / Emoji */}
        <div className="flex h-19 w-19 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-[#f0f5ef] sm:h-16 sm:w-16">
          {product.image ? (
            <span
              className="text-4xl transition-transform duration-300 group-hover:scale-105"
              role="img"
              aria-label={product.nameBn}
            >
              {product.image}
            </span>
          ) : (
            <span className="text-sm text-gray-400">
              ছবি নেই
            </span>
          )}
        </div>

        
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[#202923] transition-colors group-hover:text-green-700 sm:text-xl">
            {product.nameBn}
          </h3>

          <p className="mt-1 truncate text-sm text-[#333b35] sm:text-base">
            {getUnitBn(product.unit)}
          </p>
        </div>
      </div>

      
      <div className="mt-1 flex min-w-0 items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[#303830] sm:text-base">
            আজকের দাম
          </p>

          <p className="mt-0.5 truncate text-lg font-extrabold leading-tight text-[#202923] sm:text-2xl">
            {formatPrice(product.today)} টাকা
          </p>
        </div>

       
        <div className="shrink-0">
          {isPriceUp && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f0f5ef] px-2 py-1 text-xs font-bold text-[#c83d42] sm:px-3 sm:py-2 sm:text-sm">
              <span aria-hidden="true">▲</span>
              {formatPrice(product.change.pct)}%
            </span>
          )}

          
          {isPriceDown && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f0f5ef] px-2 py-1 text-xs font-bold text-[#21965b] sm:px-3 sm:py-2 sm:text-sm">
              <span aria-hidden="true">▼</span>
              {formatPrice(product.change.pct)}%
            </span>
          )}

          
          {isPriceFlat && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f0f5ef] px-2 py-1 text-xs font-bold text-gray-600 sm:px-3 sm:py-2 sm:text-sm">
              <span aria-hidden="true">—</span>
              ০.০%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import ProductCard from "@/components/home/ProductCard";
import type { Product } from "@/lib/types";

interface CategoryProductsClientProps {
  products: Product[];
}

type SortOption = "default" | "low-to-high" | "high-to-low";

export default function CategoryProductsClient({
  products,
}: CategoryProductsClientProps) {
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortBy === "low-to-high") {
      result.sort((a, b) => a.today - b.today);
    } else if (sortBy === "high-to-low") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sortBy]);

  return (
    <div className="container mx-auto">
    <section>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            পণ্যের তালিকা
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            এই ক্যাটাগরির সব পণ্য এক নজরে দেখুন।
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label
            htmlFor="category-sort"
            className="text-sm font-medium text-gray-700"
          >
            সাজান:
          </label>

          <select
            id="category-sort"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            className="w-full rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 sm:w-auto"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-to-high">দাম: কম থেকে বেশি</option>
            <option value="high-to-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
          <div className="text-5xl" role="img" aria-label="Shopping cart">
            🛒
          </div>

          <h3 className="mt-4 text-lg font-bold text-gray-800">
            কোনো পণ্য পাওয়া যায়নি
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      )}
    </section>
    </div>
  );
}
import Link from "next/link";
import { notFound } from "next/navigation";

import CategoryProductsClient from "@/components/category/CategoryProductsClient";
import { getProducts } from "@/lib/products";
import { getProductEmoji } from "@/lib/productsEmojis";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  // Fetch all products
  const products = await getProducts();

  // Filter products by category slug
  const categoryProducts = products.filter(
    (product) => product.category === slug
  );

  // Invalid category or no products found
  if (categoryProducts.length === 0) {
    notFound();
  }

  // Get category information from the first product
  const category = categoryProducts[0];

  const categoryName = category.categoryNameBn;
  const categoryIcon =
    category.categoryIcon || getProductEmoji(categoryName);

  return (
    <main className="min-h-screen bg-[#f5f9f4] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link
            href="/"
            className="transition-colors hover:text-green-700"
          >
            হোম
          </Link>

          <span aria-hidden="true">/</span>

          <span className="font-medium text-green-700">
            {categoryName}
          </span>
        </nav>

        {/* Category Header */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">
          <div className="flex flex-col gap-5 bg-linear-to-r from-green-50 via-lime-50 to-emerald-100 p-5 sm:flex-row sm:items-center sm:p-8">

            {/* Category Icon */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-green-100 bg-white text-5xl shadow-sm sm:h-24 sm:w-24">
              <span role="img" aria-label={categoryName}>
                {categoryIcon}
              </span>
            </div>

            {/* Category Information */}
            <div className="flex-1">
              <p className="text-sm font-medium text-green-700">
                পণ্যের ক্যাটাগরি
              </p>

              <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                {categoryName}
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                এই ক্যাটাগরির নিত্যপ্রয়োজনীয় পণ্যের
                বর্তমান বাজারদর দেখুন।
              </p>

              {/* Product Count */}
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-800">
                  মোট {categoryProducts.length}টি পণ্য
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Product List and Sorting */}
        <CategoryProductsClient products={categoryProducts} />

        {/* Back to Home */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
          >
            <span aria-hidden="true">←</span>
            হোম পেজে ফিরে যান
          </Link>
        </div>

      </div>
    </main>
  );
}
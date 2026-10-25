
import type { Product } from "@/lib/types";
import ProductCard from "@/components/home/ProductCard";

interface HomePageProps {
  products: Product[];
}

export default function HomePage({ products }: HomePageProps) {
  const priceIncreased = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const priceDecreased = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              আজ দাম বেড়েছে <span className="text-green-600">▲</span>
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              যেসব পণ্যের দাম আজ বেড়েছে
            </p>
          </div>

          {priceIncreased.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3">
              {priceIncreased.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white p-5 text-center text-sm text-gray-500">
              বর্তমানে দাম বেড়েছে এমন কোনো পণ্যের তথ্য নেই।
            </p>
          )}
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              আজ দাম কমেছে <span className="text-red-600">▼</span>
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              যেসব পণ্যের দাম আজ কমেছে
            </p>
          </div>

          {priceDecreased.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3">
              {priceDecreased.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white p-5 text-center text-sm text-gray-500">
              বর্তমানে দাম কমেছে এমন কোনো পণ্যের তথ্য নেই।
            </p>
          )}
        </section>

        <section id="all-products" className="scroll-mt-24">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              সব পণ্য
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white p-5 text-center text-sm text-gray-500">
              কোনো পণ্যের তথ্য পাওয়া যায়নি।
            </p>
          )}
        </section>
      </div>
    </div>
  );
}


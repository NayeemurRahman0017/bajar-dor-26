"use client";

import { useEffect, useState } from "react";
import { toBengaliNumber } from "@/lib/utils";

type TickerProduct = {
  id?: number | string;
  slug?: string;
  nameBn?: string;
  name?: string;
  today?: number;
  price?: number;
  change?: {
    dir?: "up" | "down" | "flat";
    pct?: number;
  };
};

export default function PriceTicker() {
  const [products, setProducts] = useState<TickerProduct[]>([]);

  useEffect(() => {
    let active = true;

    async function loadPrices() {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products"
        );

        if (!response.ok) {
          throw new Error("Product request failed");
        }

        const result = await response.json();

        const list = Array.isArray(result)
          ? result
          : result.products ?? result.data ?? [];

        if (active && Array.isArray(list)) {
          setProducts(list.slice(0, 12));
        }
      } catch (error) {
        console.error("Ticker loading error:", error);
      }
    }

    loadPrices();

    return () => {
      active = false;
    };
  }, []);

  const tickerItems = products.length
    ? products
    : [
        { id: "fallback", nameBn: "আজকের বাজারদর দেখুন" },
        { id: "fallback-2", nameBn: "পণ্যের সর্বশেষ দাম জানতে" },
      ];

  return (
    <div className="sticky top-18 z-30 mx-auto w-full lg:top-32.5">
      <div className="overflow-hidden border-b border-green-100 bg-green-50">
        <div className="mx-auto flex max-w-7xl items-center">
          <div className="z-10 shrink-0 bg-green-700 px-3 py-2 text-xs font-bold text-white sm:px-4 sm:text-sm">
            বাজারদর
          </div>

          <div className="min-w-0 flex-1 overflow-hidden py-2">
            <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="flex items-center gap-8"
                  aria-hidden={copy === 1}
                >
                  {tickerItems.map((product, index) => {
                    const name = product.nameBn ?? product.name ?? "পণ্য";
                    const price = product.today ?? product.price;
                    const direction = product.change?.dir;

                    const changeColor =
                      direction === "up"
                        ? "text-red-600"
                        : direction === "down"
                          ? "text-green-700"
                          : "text-gray-500";

                    return (
                      <span
                        key={`${product.id ?? product.slug ?? name}-${index}`}
                        className="flex items-center gap-2 text-xs sm:text-sm"
                      >
                        <span className="font-medium text-gray-700">
                          {name}
                        </span>

                        {typeof price === "number" && (
                          <span className="font-bold text-gray-900">
                            ৳{toBengaliNumber(price)}
                          </span>
                        )}

                        {typeof product.change?.pct === "number" && (
                          <span className={`font-semibold ${changeColor}`}>
                            {direction === "up"
                              ? "▲"
                              : direction === "down"
                                ? "▼"
                                : "•"}{" "}
                            {toBengaliNumber(product.change.pct)}%
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
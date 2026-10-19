import type { Product } from "@/lib/types";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

type RawProduct = Record<string, unknown>;

function getString(
  item: RawProduct,
  keys: string[],
  fallback = "",
): string {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return fallback;
}

function getNumber(item: RawProduct, keys: string[]): number {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value.replace(/,/g, ""));

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return 0;
}

function extractProducts(data: unknown): RawProduct[] {
  if (Array.isArray(data)) {
    return data.filter(
      (item): item is RawProduct =>
        typeof item === "object" && item !== null,
    );
  }

  if (typeof data !== "object" || data === null) {
    return [];
  }

  const object = data as RawProduct;

  for (const key of ["data", "products", "items", "results"]) {
    const result = extractProducts(object[key]);

    if (result.length > 0) {
      return result;
    }
  }

  return [];
}

function normalizeProduct(item: RawProduct): Product {
  const id = getString(item, ["id", "productId", "_id"]);

  const categoryValue = item.category;

  const categoryObject =
    typeof categoryValue === "object" && categoryValue !== null
      ? (categoryValue as RawProduct)
      : null;

  const category = categoryObject
    ? getString(categoryObject, ["slug", "id", "nameBn", "name"])
    : getString(item, [
        "categorySlug",
        "category_slug",
        "category",
      ]);

  const categoryNameBn =
    getString(item, [
      "categoryNameBn",
      "category_name_bn",
      "categoryName",
    ]) ||
    (categoryObject
      ? getString(categoryObject, ["nameBn", "name", "title"])
      : "");

  const today = getNumber(item, [
    "today",
    "currentPrice",
    "current_price",
    "priceToday",
    "price",
  ]);

  const yesterday = getNumber(item, [
    "yesterday",
    "previousPrice",
    "previous_price",
    "priceYesterday",
  ]);

  const changeObject =
    typeof item.change === "object" && item.change !== null
      ? (item.change as RawProduct)
      : null;

  let changeDir: "up" | "down" | "flat" = "flat";
  let changePct = 0;

  if (changeObject) {
    const direction = getString(changeObject, [
      "dir",
      "direction",
    ]).toLowerCase();

    if (
      direction === "up" ||
      direction === "down" ||
      direction === "flat"
    ) {
      changeDir = direction;
    }

    changePct = getNumber(changeObject, ["pct", "percentage"]);
  } else if (yesterday > 0) {
    changePct = ((today - yesterday) / yesterday) * 100;

    if (today > yesterday) {
      changeDir = "up";
    } else if (today < yesterday) {
      changeDir = "down";
    }
  }

  const rawMarkets = Array.isArray(item.markets)
    ? item.markets
    : [];

  const markets = rawMarkets
    .filter(
      (market): market is RawProduct =>
        typeof market === "object" && market !== null,
    )
    .map((market) => ({
      market: getString(market, [
        "market",
        "name",
        "marketName",
      ]),
      division: getString(market, ["division", "district"]),
      min: getNumber(market, ["min", "minPrice", "min_price"]),
      max: getNumber(market, ["max", "maxPrice", "max_price"]),
    }));

  
  const image = getString(item, [
    "image",
    "imageUrl",
    "image_url",
    "imageURL",
    "img",
    "thumbnail",
    "photo",
    "picture",
    "imageSrc",
    "image_src",
    "productImage",
    "product_image",
  ]);

  const slug =
    getString(item, ["slug", "productSlug", "product_slug"]) ||
    id;

  return {
    id: Number(id) || 0,
    slug,
    nameBn: getString(item, [
      "nameBn",
      "name_bn",
      "name",
      "title",
    ]),
    category,
    categoryNameBn,
    categoryIcon: getString(item, [
      "categoryIcon",
      "category_icon",
    ]),
    unit: getString(item, [
      "unit",
      "measurementUnit",
      "measurement_unit",
    ]),
    image,
    today,
    yesterday,
    lastWeek: getNumber(item, ["lastWeek", "last_week"]),
    lastMonth: getNumber(item, ["lastMonth", "last_month"]),
    change: {
      dir: changeDir,
      pct: Math.round(Math.abs(changePct) * 100) / 100,
    },
    markets,
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Products API failed: ${response.status}`);
    }

    const result: unknown = await response.json();
    const rawProducts = extractProducts(result);

    const products = rawProducts
      .map(normalizeProduct)
      .filter((product) => product.nameBn.length > 0);


    return products;
  } catch (error) {
    console.error(
      "Failed to fetch BazarDor products:",
      error,
    );

    return [];
  }
}
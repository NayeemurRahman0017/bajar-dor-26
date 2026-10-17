import Hero from "@/components/home/Hero";
import HomePage from "@/components/home/HomePage";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#f5f9f4]">
      <Hero />
      <HomePage products={products} />
    </main>
  );
}
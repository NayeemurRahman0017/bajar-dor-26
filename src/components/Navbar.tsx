
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

type Category = {
  id?: string;
  slug: string;
  nameBn: string;
  icon?: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/categories"
        );

        if (!response.ok) throw new Error("Categories request failed");

        const result = await response.json();
        const list = Array.isArray(result)
          ? result
          : result.categories ?? result.data ?? [];

        if (active && Array.isArray(list)) {
          setCategories(list.slice(0, 6));
        }
      } catch (error) {
        console.error("Category loading error:", error);
      }
    }

    loadCategories();
    return () => {
      active = false;
    };
  }, []);

  async function handleSignOut() {
    try {
      await authClient.signOut();
      toast.success("সফলভাবে লগআউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("লগআউট করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  const linkClass = (href: string) =>
    `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
      pathname === href
        ? "bg-green-100 text-green-800"
        : "text-gray-700 hover:bg-green-50 hover:text-green-800"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-green-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="বাজার দর হোম"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-xl text-white">
            ৳
          </span>
          <span className="text-xl font-bold tracking-tight text-green-800 sm:text-2xl">
            বাজার দর
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link href="/" className={linkClass("/")}>
            হোম
          </Link>
          <Link href="/products" className={linkClass("/products")}>
            সব পণ্য
          </Link>
          {categories.slice(0, 3).map((category) => (
            <Link
              key={category.id ?? category.slug}
              href={`/category/${category.slug}`}
              className={linkClass(`/category/${category.slug}`)}
            >
              {category.nameBn}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {isPending ? (
            <span className="h-9 w-20 animate-pulse rounded-lg bg-gray-100" />
          ) : session?.user ? (
            <>
              <Link
                href="/profile"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-green-50"
              >
                প্রোফাইল
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-green-700 px-4 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-700 hover:text-white"
              >
                লগআউট
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-50"
              >
                লগইন
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                রেজিস্টার
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg border border-green-100 px-3 py-2 text-sm font-semibold text-green-800 lg:hidden"
          aria-expanded={menuOpen}
          aria-label="মেনু খুলুন"
        >
          {menuOpen ? "বন্ধ করুন ✕" : "☰ মেনু"}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-green-100 bg-white px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={linkClass("/")}
            >
              হোম
            </Link>
            <Link
              href="/products"
              onClick={() => setMenuOpen(false)}
              className={linkClass("/products")}
            >
              সব পণ্য
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id ?? category.slug}
                href={`/category/${category.slug}`}
                onClick={() => setMenuOpen(false)}
                className={linkClass(`/category/${category.slug}`)}
              >
                {category.icon ? `${category.icon} ` : ""}
                {category.nameBn}
              </Link>
            ))}

            <div className="mt-2 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
              {session?.user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-800"
                  >
                    প্রোফাইল
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    লগআউট
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-green-800"
                  >
                    লগইন
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white"
                  >
                    রেজিস্টার
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import logo from "@/assets/logo-icon.png";

type Category = {
id?: string;
slug: string;
nameBn: string;
icon?: string;
};

function subscribeToNothing() {
return () => {};
}

function getBanglaDate() {
return new Intl.DateTimeFormat("bn-BD", {
weekday: "long",
day: "numeric",
month: "long",
year: "numeric",
timeZone: "Asia/Dhaka",
}).format(new Date());
}

function useBanglaDate() {
return useSyncExternalStore(
subscribeToNothing,
getBanglaDate,
() => "বাংলাদেশের বাজারদর"
);
}

function NavbarContent() {
const pathname = usePathname();
const router = useRouter();
const { data: session, isPending } = authClient.useSession();

const [categories, setCategories] = useState<Category[]>([]);
const [menuOpen, setMenuOpen] = useState(false);
const banglaDate = useBanglaDate();

useEffect(() => {
let active = true;

async function loadCategories() {
  try {
    const response = await fetch(
      "https://api.api-store.workers.dev/api/bazardor/categories"
    );

    if (!response.ok) {
      throw new Error("Failed to load categories");
    }

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


  toast.success("সফলভাবে সাইন আউট হয়েছে");
  setMenuOpen(false);
  router.push("/");
  router.refresh();
} catch {
  toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
}


}

function linkClass(href: string) {
const isActive =
pathname === href || pathname.startsWith(`${href}/`);

return `flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
  isActive
    ? "bg-green-100 text-green-800"
    : "text-gray-700 hover:bg-green-50 hover:text-green-800"
}`;


}

function closeMenu() {
setMenuOpen(false);
}

return ( <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
{/* First Row: Logo + Authentication */} <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
{/* Logo and Bangla Date */} <Link
       href="/"
       onClick={closeMenu}
       aria-label="বাজার দর হোম"
       className="flex min-w-0 items-center gap-3"
     > <Image
         src={logo}
         alt="বাজার দর লোগো"
         width={48}
         height={48}
         priority
         className="h-12 w-12 shrink-0 object-contain"
       />

      <span className="flex min-w-0 flex-col">
        <span className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
          বাজার দর
        </span>

        <span className="mt-1 text-xs text-gray-500 sm:text-sm">
          {banglaDate}
        </span>
      </span>
    </Link>

    {/* Desktop Authentication */}
    <div className="hidden shrink-0 items-center gap-2 sm:flex">
      {isPending ? (
        <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
      ) : session?.user ? (
        <>
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-green-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-800">
              {session.user.name?.charAt(0) || "👤"}
            </span>

            <span className="max-w-28 truncate">
              {session.user.name || "প্রোফাইল"}
            </span>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            সাইন আউট
          </button>
        </>
      ) : (
        <>
          <Link
            href="/signin"
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-green-800 hover:bg-green-50"
          >
            সাইন ইন
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
          >
            সাইন আপ
          </Link>
        </>
      )}
    </div>

    {/* Mobile Menu Button */}
    <button
      type="button"
      onClick={() => setMenuOpen((open) => !open)}
      aria-expanded={menuOpen}
      aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-green-50 lg:hidden"
    >
      {menuOpen ? "✕" : "☰"}
    </button>
  </div>

  {/* Desktop Category Navigation */}
  <div className="hidden border-t border-gray-100 lg:block">
    <nav
      aria-label="প্রধান নেভিগেশন"
      className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2 sm:px-6"
    >
      {categories.map((category) => (
        <Link
          key={category.id ?? category.slug}
          href={`/category/${category.slug}`}
          className={linkClass(`/category/${category.slug}`)}
        >
          {category.icon && <span>{category.icon}</span>}
          {category.nameBn}
        </Link>
      ))}
    </nav>
  </div>

  {/* Mobile Menu */}
  {menuOpen && (
    <div className="border-t border-gray-100 bg-white px-4 py-3 lg:hidden">
      <nav
        aria-label="মোবাইল নেভিগেশন"
        className="flex flex-col gap-1.5"
      >
        {categories.map((category) => (
          <Link
            key={category.id ?? category.slug}
            href={`/category/${category.slug}`}
            onClick={closeMenu}
            className={linkClass(`/category/${category.slug}`)}
          >
            {category.icon && <span>{category.icon}</span>}
            {category.nameBn}
          </Link>
        ))}
      </nav>

      {/* Mobile Authentication */}
      <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
        {isPending ? (
          <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
        ) : session?.user ? (
          <>
            <Link
              href="/profile"
              onClick={closeMenu}
              className="rounded-lg bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-800"
            >
              প্রোফাইল
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700"
            >
              সাইন আউট
            </button>
          </>
        ) : (
          <>
            <Link
              href="/signin"
              onClick={closeMenu}
              className="rounded-lg border border-green-700 px-4 py-2.5 text-sm font-semibold text-green-800"
            >
              সাইন ইন
            </Link>
            <Link
              href="/signup"
              onClick={closeMenu}
              className="rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white"
            >
              সাইন আপ
            </Link>
          </>
        )}
      </div>
    </div>
  )}
</header>

);
}

function NavbarFallback() {
return ( <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm"> <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6"> <Image
       src={logo}
       alt="বাজার দর লোগো"
       width={48}
       height={48}
       priority
       className="h-12 w-12 object-contain"
     />


    <span className="text-xl font-bold text-gray-900">
      বাজার দর
    </span>
  </div>
</header>

);
}

export default function Navbar() {
return (
<Suspense fallback={<NavbarFallback />}> <NavbarContent /> </Suspense>
);
}

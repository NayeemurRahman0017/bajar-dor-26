
"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface ProfileContentProps {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
}

export default function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [updating, setUpdating] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    if (trimmedName === user.name) {
      toast("কোনো পরিবর্তন করা হয়নি");
      return;
    }

    setUpdating(true);

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        toast.error(result.error.message || "তথ্য আপডেট করা যায়নি");
        return;
      }

      toast.success("প্রোফাইল আপডেট সফল হয়েছে!");
      router.refresh();
    } catch {
      toast.error("আপডেট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setUpdating(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি");
        return;
      }

      toast.success("সাইন আউট সফল!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট ব্যর্থ হয়েছে");
    } finally {
      setSigningOut(false);
    }
  }

  const initial = user.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <main className="min-h-[calc(100vh-1px)] bg-[#f1f5f1] px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            আমার প্রোফাইল
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* User information card */}
        <section className="mb-7 flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex min-w-0 items-center gap-4">
            {user.image ? (
              <Image
                src={user.image}
                width={80}
                height={80}
                alt={user.name || "Profile"}
                className="h-20 w-20 shrink-0 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-800">
                {initial}
              </div>
            )}

            <div className="min-w-0">
              <h2 className="wrap-break-word text-lg font-bold text-gray-900 sm:text-xl">
                {user.name || "ব্যবহারকারী"}
              </h2>
              <p className="mt-1 break-all text-sm text-gray-600 sm:text-base">
                {user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut || updating}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-red-300 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60 sm:self-center"
          >
            {signingOut ? "সাইন আউট হচ্ছে..." : "↪ সাইন আউট"}
          </button>
        </section>

        {/* Profile update card */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-7 text-xl font-bold text-gray-900">
            তথ্য
          </h2>

          <form onSubmit={handleUpdate}>
            <div className="mb-5">
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                নাম
              </label>

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                autoComplete="name"
                required
                maxLength={100}
                className="input input-bordered h-12 min-h-0 w-full bg-white text-base text-gray-900 focus:border-green-700 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={updating || signingOut}
              className="btn h-12 min-h-0 w-full border-none bg-[#087b45] text-base font-semibold text-white hover:bg-[#06663a] disabled:opacity-60"
            >
              {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </section>

        <div className="mt-6 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-green-700">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
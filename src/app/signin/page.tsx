
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

export default function SigninPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | ""
  >("");

  async function handleSignin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        toast.error(
          result.error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়"
        );
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে!");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "সাইন ইন করা যায়নি। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(provider: "google" | "github") {
    setSocialLoading(provider);

    try {
      const result = await signIn.social({
        provider,
        callbackURL: "/",
        errorCallbackURL: "/signin",
      });

      if (result.error) {
        toast.error(
          result.error.message || "সোশ্যাল লগইন ব্যর্থ হয়েছে"
        );
        setSocialLoading("");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "সোশ্যাল লগইন ব্যর্থ হয়েছে"
      );
      setSocialLoading("");
    }
  }

  return (
    <main className="min-h-[calc(100vh-1rem)] bg-[#f0f6f0] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-bold text-[#202820]">
          সাইন ইন
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          নিজের অ্যাকাউন্টে প্রবেশ করুন এবং প্রয়োজনীয় তথ্য দেখুন
        </p>

        <div className="mx-auto mt-7 w-full max-w-sm rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm sm:p-6">
          <form onSubmit={handleSignin} className="space-y-3">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                ইমেইল
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || !!socialLoading}
                className="input input-bordered h-10 min-h-0 w-full bg-white text-sm outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                পাসওয়ার্ড
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="আপনার পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || !!socialLoading}
                className="input input-bordered h-10 min-h-0 w-full bg-white text-sm outline-none focus:border-green-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!socialLoading}
              className="btn h-10 min-h-0 w-full border-none bg-[#078b45] text-sm font-semibold text-white hover:bg-[#06763b] disabled:opacity-60"
            >
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">অথবা</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={loading || !!socialLoading}
              className="flex h-10 items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              <span className="font-bold text-[#4285F4]">G</span>
              {socialLoading === "google"
                ? "অপেক্ষা করুন..."
                : "Google দিয়ে"}
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              disabled={loading || !!socialLoading}
              className="flex h-10 items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              <span className="font-semibold text-black">●</span>
              {socialLoading === "github"
                ? "অপেক্ষা করুন..."
                : "GitHub দিয়ে"}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-600">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-medium text-green-700 hover:underline"
            >
              নতুন অ্যাকাউন্ট তৈরি করুন
            </Link>
          </p>
        </div>

        <p className="mt-5 text-xs text-gray-400">
          ←{" "}
          <Link href="/" className="hover:text-green-700">
            হোম পেজে ফিরে যান
          </Link>
        </p>
      </div>
    </main>
  );
}


"use client";

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn, signUp } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | ""
  >("");

  async function handleSignup(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 2) {
      toast.error("কমপক্ষে ২ অক্ষরের নাম লিখুন");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        name: cleanName,
        email: cleanEmail,
        password,
      });

      if (result.error) {
        toast.error(
          result.error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে"
        );
        return;
      }

      toast.success("রেজিস্ট্রেশন সফল হয়েছে!");

      router.push("/signin");
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? `রেজিস্ট্রেশন ব্যর্থ: ${error.message}`
          : "রেজিস্ট্রেশন ব্যর্থ হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(
    provider: "google" | "github"
  ) {
    setSocialLoading(provider);

    try {
      const result = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result.error) {
        toast.error(
          result.error.message ||
            `${provider} দিয়ে লগইন করা যায়নি`
        );

        setSocialLoading("");
      }
    } catch (error: unknown) {
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
          অ্যাকাউন্ট তৈরি করুন
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          নিবন্ধন করুন, বাজার দর দেখুন এবং প্রয়োজনীয় তথ্য
          সংরক্ষণ করুন
        </p>

        <div className="mx-auto mt-7 w-full max-w-sm rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm sm:p-6">
          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                নাম
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="আপনার পুরো নাম"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                disabled={loading || !!socialLoading}
                className="input input-bordered h-10 min-h-0 w-full bg-white text-sm outline-none focus:border-green-600"
              />
            </div>

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
                autoComplete="new-password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={loading || !!socialLoading}
                className="input input-bordered h-10 min-h-0 w-full bg-white text-sm outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="আবার পাসওয়ার্ড লিখুন"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
                minLength={8}
                disabled={loading || !!socialLoading}
                className="input input-bordered h-10 min-h-0 w-full bg-white text-sm outline-none focus:border-green-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!socialLoading}
              className="btn h-10 min-h-0 w-full border-none bg-[#078b45] text-sm font-semibold text-white hover:bg-[#06763b] disabled:opacity-60"
            >
              {loading
                ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs text-gray-500">
              অথবা
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={loading || !!socialLoading}
              className="flex h-10 items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              <span className="font-bold text-[#4285F4]">
                G
              </span>

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
              <span className="font-semibold text-black">
                ●
              </span>

              {socialLoading === "github"
                ? "অপেক্ষা করুন..."
                : "GitHub দিয়ে"}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-600">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="font-medium text-green-700 hover:underline"
            >
              সাইন ইন করুন
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
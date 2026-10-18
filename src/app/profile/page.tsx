import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileContent from "@/components/profile/ProfileContent";

async function ProfileData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?callbackUrl=%2Fprofile");
  }

  return (
    <ProfileContent
      user={{
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
      }}
    />
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f1f5f1] px-4 py-12">
          <div className="mx-auto max-w-4xl animate-pulse">
            <div className="mb-7 h-8 w-48 rounded bg-gray-200" />
            <div className="mb-7 h-32 rounded-2xl bg-white" />
            <div className="h-64 rounded-2xl bg-white" />
          </div>
        </main>
      }
    >
      <ProfileData />
    </Suspense>
  );
}
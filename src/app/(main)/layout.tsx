"use client";

import { AppHeader } from "@/components/app-header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // This effect should only run on the client where localStorage is available
    if (typeof window !== "undefined") {
      const hasSignedUp = localStorage.getItem("simushop_has_signed_up");
      if (hasSignedUp !== "true") {
        router.replace("/signup");
      } else {
        setIsVerified(true);
      }
    }
  }, [router]);

  if (!isVerified) {
    // Show a loading state to prevent flash of content and mismatched server/client render
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <div className="container relative">{children}</div>
      </main>
    </div>
  );
}

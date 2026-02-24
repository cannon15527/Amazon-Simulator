"use client";

import { AppHeader } from "@/components/app-header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDate } from "@/hooks/use-date";
import { format } from "date-fns";

function TopBar() {
  const { currentDate } = useDate();
  // Don't render on the server or until hydrated, since date is client-side
  if (!currentDate) return null;

  return (
    <div className="bg-muted/50 text-muted-foreground text-xs text-center py-1.5">
      <div className="container">
        <span>Today's simulated date is: {format(currentDate, "MMMM d, yyyy")}</span>
      </div>
    </div>
  );
}


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
      <TopBar />
      <AppHeader />
      <main className="flex-1">
        <div className="container relative">{children}</div>
      </main>
    </div>
  );
}

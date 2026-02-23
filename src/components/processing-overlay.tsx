"use client";

import { Loader2, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function ProcessingOverlay({ show }: { show: boolean }) {
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (show) {
      setIsSuccess(false); // Reset on show
      timer = setTimeout(() => {
        setIsSuccess(true);
      }, 5000); // Animate to success after 5s
    }
    return () => clearTimeout(timer);
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      {/* Icon Container */}
      <div className="relative h-16 w-16">
        <Loader2
          className={cn(
            "absolute h-full w-full animate-spin text-primary transition-opacity duration-300",
            isSuccess ? "opacity-0 scale-50" : "opacity-100 scale-100"
          )}
        />
        <CheckCircle
          className={cn(
            "absolute h-full w-full text-green-600 transition-all duration-300 delay-100",
            isSuccess ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}
        />
      </div>

      {/* Text Container */}
      <div className="relative mt-4 h-12 w-64 text-center">
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300",
            isSuccess ? "opacity-0" : "opacity-100"
          )}
        >
          <p className="text-lg font-semibold">Processing Transaction...</p>
          <p className="text-sm text-muted-foreground">Contacting your virtual bank.</p>
        </div>
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 delay-100",
            isSuccess ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="text-lg font-semibold text-green-600">Transaction Complete!</p>
        </div>
      </div>
    </div>
  );
}

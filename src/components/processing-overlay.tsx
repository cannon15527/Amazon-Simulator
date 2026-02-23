"use client";

import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProcessingOverlay({ show, status = 'processing' }: { show: boolean, status?: 'processing' | 'success' | 'declined' }) {
  if (!show) {
    return null;
  }

  const isProcessing = status === 'processing';
  const isSuccess = status === 'success';
  const isDeclined = status === 'declined';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      {/* Icon Container */}
      <div className="relative h-16 w-16">
        <Loader2
          className={cn(
            "absolute h-full w-full animate-spin text-primary transition-opacity duration-300",
            !isProcessing ? "opacity-0" : "opacity-100"
          )}
        />
        <CheckCircle
          className={cn(
            "absolute h-full w-full text-green-600 transition-all duration-300 delay-100",
            isSuccess ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}
        />
        <XCircle
           className={cn(
            "absolute h-full w-full text-destructive transition-all duration-300 delay-100",
            isDeclined ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}
        />
      </div>

      {/* Text Container */}
      <div className="relative mt-4 h-12 w-64 text-center">
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300",
            !isProcessing ? "opacity-0" : "opacity-100"
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
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 delay-100",
            isDeclined ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="text-lg font-semibold text-destructive">Transaction Declined</p>
          <p className="text-sm text-muted-foreground">Please check your funds.</p>
        </div>
      </div>
    </div>
  );
}

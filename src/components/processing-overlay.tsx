"use client";

import { Loader2 } from "lucide-react";

export function ProcessingOverlay({ show }: { show: boolean }) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="mt-4 text-lg font-semibold">Processing Transaction...</p>
      <p className="text-muted-foreground">Contacting your virtual bank.</p>
    </div>
  );
}

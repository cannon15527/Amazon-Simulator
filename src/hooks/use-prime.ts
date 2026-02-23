"use client";

import { PrimeContext } from "@/components/providers/prime-provider";
import { useContext } from "react";

export const usePrime = () => {
  const context = useContext(PrimeContext);
  if (!context) {
    throw new Error("usePrime must be used within a PrimeProvider");
  }
  return context;
};

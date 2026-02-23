"use client";

import { FinanceContext } from "@/components/providers/finance-provider";
import { useContext } from "react";

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

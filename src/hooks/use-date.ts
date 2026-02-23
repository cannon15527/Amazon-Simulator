"use client";

import { DateContext } from "@/components/providers/date-provider";
import { useContext } from "react";

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};

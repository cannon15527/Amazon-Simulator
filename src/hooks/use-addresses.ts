"use client";

import { AddressContext } from "@/components/providers/address-provider";
import { useContext } from "react";

export const useAddresses = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddresses must be used within an AddressProvider");
  }
  return context;
};

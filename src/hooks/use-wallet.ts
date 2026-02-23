"use client";

import { WalletContext } from "@/components/providers/wallet-provider";
import { useContext } from "react";

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

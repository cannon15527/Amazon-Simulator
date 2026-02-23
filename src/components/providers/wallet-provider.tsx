"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";
import { INITIAL_WALLET_BALANCE } from "@/lib/constants";

interface WalletContextType {
  balance: number;
  setBalance: (balance: number) => void;
  deduct: (amount: number) => boolean;
  addFunds: (amount: number) => void;
}

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = "simushop_wallet_balance";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(INITIAL_WALLET_BALANCE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedBalance = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedBalance) {
        setBalance(JSON.parse(storedBalance));
      }
    } catch (error) {
      console.error("Failed to parse wallet balance from localStorage", error);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(balance));
    }
  }, [balance, isHydrated]);

  const deduct = (amount: number) => {
    if (balance >= amount) {
      setBalance((prev) => prev - amount);
      return true;
    }
    return false;
  };

  const addFunds = (amount: number) => {
    setBalance((prev) => prev + amount);
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <WalletContext.Provider value={{ balance, setBalance, deduct, addFunds }}>
      {children}
    </WalletContext.Provider>
  );
}

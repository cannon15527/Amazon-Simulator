"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { PRIME_COST } from "@/lib/constants";

interface PrimeContextType {
  isPrime: boolean;
  subscribe: () => boolean;
  unsubscribe: () => void;
}

export const PrimeContext = createContext<PrimeContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = "simushop_prime_status";

export function PrimeProvider({ children }: { children: ReactNode }) {
  const [isPrime, setIsPrime] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { deduct } = useWallet();

  useEffect(() => {
    try {
      const storedPrimeStatus = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPrimeStatus) {
        setIsPrime(JSON.parse(storedPrimeStatus));
      }
    } catch (error) {
      console.error("Failed to parse prime status from localStorage", error);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(isPrime));
    }
  }, [isPrime, isHydrated]);

  const subscribe = () => {
    if (deduct(PRIME_COST)) {
      setIsPrime(true);
      return true;
    }
    return false;
  };

  const unsubscribe = () => {
    setIsPrime(false);
  };
  
  if (!isHydrated) {
      return null;
  }

  return (
    <PrimeContext.Provider value={{ isPrime, subscribe, unsubscribe }}>
      {children}
    </PrimeContext.Provider>
  );
}

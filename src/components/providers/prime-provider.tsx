"use client";

import { createContext, useState, useEffect, type ReactNode, useCallback } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { PRIME_COST, PRIME_RENEWAL_SECONDS } from "@/lib/constants";

interface PrimeContextType {
  isPrime: boolean;
  subscribe: () => boolean;
  unsubscribe: () => void;
  timeLeft: number | null;
  willCancel: boolean;
}

export const PrimeContext = createContext<PrimeContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY_STATUS = "simushop_prime_status";
const LOCAL_STORAGE_KEY_RENEWAL = "simushop_prime_renewal_time";
const LOCAL_STORAGE_KEY_WILL_CANCEL = "simushop_prime_will_cancel";

export function PrimeProvider({ children }: { children: ReactNode }) {
  const [isPrime, setIsPrime] = useState(false);
  const [renewalTime, setRenewalTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [willCancel, setWillCancel] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { deduct } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedPrimeStatus = localStorage.getItem(LOCAL_STORAGE_KEY_STATUS);
      const storedRenewalTime = localStorage.getItem(LOCAL_STORAGE_KEY_RENEWAL);
      const storedWillCancel = localStorage.getItem(LOCAL_STORAGE_KEY_WILL_CANCEL);
      if (storedPrimeStatus) {
        setIsPrime(JSON.parse(storedPrimeStatus));
      }
      if (storedWillCancel) {
        setWillCancel(JSON.parse(storedWillCancel));
      }
      if (storedRenewalTime) {
        const parsedRenewal = JSON.parse(storedRenewalTime);
        // If the renewal time is in the past, the subscription expired while they were away
        if (parsedRenewal && parsedRenewal > Date.now()) {
            setRenewalTime(parsedRenewal);
        } else {
            setIsPrime(false); // Expired
            setWillCancel(false);
        }
      }
    } catch (error) {
      console.error("Failed to parse prime status from localStorage", error);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(LOCAL_STORAGE_KEY_STATUS, JSON.stringify(isPrime));
      localStorage.setItem(LOCAL_STORAGE_KEY_WILL_CANCEL, JSON.stringify(willCancel));
      if (renewalTime && isPrime) {
          localStorage.setItem(LOCAL_STORAGE_KEY_RENEWAL, JSON.stringify(renewalTime));
      } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY_RENEWAL);
      }
    }
  }, [isPrime, renewalTime, isHydrated, willCancel]);

  const subscribe = () => {
    if (deduct(PRIME_COST)) {
      setIsPrime(true);
      setWillCancel(false);
      setRenewalTime(Date.now() + PRIME_RENEWAL_SECONDS * 1000);
      return true;
    }
    return false;
  };

  const cancelSubscriptionNow = useCallback(() => {
    setIsPrime(false);
    setRenewalTime(null);
    setTimeLeft(null);
    setWillCancel(false);
  }, []);

  const unsubscribe = () => {
    setWillCancel(true);
    toast({
        title: "Cancellation Pending",
        description: "Your Prime membership will be cancelled at the end of this cycle."
    })
  };
  
  useEffect(() => {
    if (!isHydrated || !isPrime || !renewalTime) {
        if (isPrime) { // Sub was expired on load
            cancelSubscriptionNow();
        }
        return;
    };

    const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.round((renewalTime - now) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
            if (willCancel) {
                cancelSubscriptionNow();
                toast({
                    title: "Subscription Cancelled",
                    description: "Your SimuShop Prime membership has expired.",
                });
            } else if (deduct(PRIME_COST)) {
                setRenewalTime(Date.now() + PRIME_RENEWAL_SECONDS * 1000);
                toast({
                    title: "Prime Renewed",
                    description: "Your SimuShop Prime membership has been renewed."
                });
            } else {
                cancelSubscriptionNow();
                toast({
                    variant: "destructive",
                    title: "Prime Renewal Failed",
                    description: "Insufficient funds. Your subscription has been cancelled.",
                });
            }
        }
    }, 1000);

    return () => clearInterval(interval);

  }, [isHydrated, isPrime, renewalTime, deduct, toast, cancelSubscriptionNow, willCancel]);

  if (!isHydrated) {
      return null;
  }

  return (
    <PrimeContext.Provider value={{ isPrime, subscribe, unsubscribe, timeLeft, willCancel }}>
      {children}
    </PrimeContext.Provider>
  );
}

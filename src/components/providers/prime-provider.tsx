"use client";

import { createContext, useState, useEffect, type ReactNode, useCallback, useContext } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { PRIME_COST } from "@/lib/constants";
import { DateContext } from "@/components/providers/date-provider";
import { addMonths, differenceInDays } from "date-fns";

interface PrimeContextType {
  isPrime: boolean;
  subscribe: () => boolean;
  unsubscribe: () => void;
  timeLeft: number | null; // Will now be days
  willCancel: boolean;
  renewalDate: Date | null;
}

export const PrimeContext = createContext<PrimeContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY_STATUS = "simushop_prime_status";
const LOCAL_STORAGE_KEY_RENEWAL = "simushop_prime_renewal_date";
const LOCAL_STORAGE_KEY_WILL_CANCEL = "simushop_prime_will_cancel";

export function PrimeProvider({ children }: { children: ReactNode }) {
  const [isPrime, setIsPrime] = useState(false);
  const [renewalDate, setRenewalDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [willCancel, setWillCancel] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const { deduct } = useWallet();
  const { toast } = useToast();
  const dateContext = useContext(DateContext);
  const currentDate = dateContext?.currentDate;

  useEffect(() => {
    try {
      const storedPrimeStatus = localStorage.getItem(LOCAL_STORAGE_KEY_STATUS);
      const storedRenewalDate = localStorage.getItem(LOCAL_STORAGE_KEY_RENEWAL);
      const storedWillCancel = localStorage.getItem(LOCAL_STORAGE_KEY_WILL_CANCEL);
      
      if (storedPrimeStatus) setIsPrime(JSON.parse(storedPrimeStatus));
      if (storedWillCancel) setWillCancel(JSON.parse(storedWillCancel));

      if (storedRenewalDate) {
        const parsedRenewal = new Date(JSON.parse(storedRenewalDate));
        if (!isNaN(parsedRenewal.getTime())) {
            setRenewalDate(parsedRenewal);
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
      if (renewalDate && isPrime) {
          localStorage.setItem(LOCAL_STORAGE_KEY_RENEWAL, JSON.stringify(renewalDate));
      } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY_RENEWAL);
      }
    }
  }, [isPrime, renewalDate, isHydrated, willCancel]);

  const subscribe = () => {
    if (!currentDate) return false;
    if (deduct(PRIME_COST)) {
      setIsPrime(true);
      setWillCancel(false);
      setRenewalDate(addMonths(currentDate, 1));
      return true;
    }
    return false;
  };

  const cancelSubscriptionNow = useCallback(() => {
    setIsPrime(false);
    setRenewalDate(null);
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
    if (!isHydrated || !currentDate) return;
    
    if (!isPrime || !renewalDate) {
        if(isPrime) cancelSubscriptionNow();
        return;
    };

    const remainingDays = differenceInDays(renewalDate, currentDate);
    setTimeLeft(remainingDays > 0 ? remainingDays : 0);

    if (remainingDays <= 0) {
        if (willCancel) {
            cancelSubscriptionNow();
            toast({
                title: "Subscription Cancelled",
                description: "Your Amazon Prime membership has expired.",
            });
        } else if (deduct(PRIME_COST)) {
            setRenewalDate(addMonths(currentDate, 1));
            toast({
                title: "Prime Renewed",
                description: "Your Amazon Prime membership has been renewed for another month."
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
  }, [isHydrated, currentDate, isPrime, renewalDate, willCancel, deduct, toast, cancelSubscriptionNow]);

  if (!isHydrated || !currentDate) {
      return null;
  }

  return (
    <PrimeContext.Provider value={{ isPrime, subscribe, unsubscribe, timeLeft, willCancel, renewalDate }}>
      {children}
    </PrimeContext.Provider>
  );
}

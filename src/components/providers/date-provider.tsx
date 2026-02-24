"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";

interface DateContextType {
  currentDate: Date;
  resetDate: () => void;
}

export const DateContext = createContext<DateContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = "simushop_simulated_date";

export function DateProvider({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedDate = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedDate) {
        const parsedDate = new Date(JSON.parse(storedDate));
        // Check if the stored date is valid before setting it
        if (!isNaN(parsedDate.getTime())) {
          setCurrentDate(parsedDate);
        }
      }
    } catch (error) {
      console.error("Failed to parse simulated date from localStorage", error);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const timer = setInterval(() => {
      setCurrentDate((prevDate) => {
        const nextDate = new Date(prevDate);
        nextDate.setDate(nextDate.getDate() + 1);
        return nextDate;
      });
    }, 1000); // A day passes every second

    return () => clearInterval(timer);
  }, [isHydrated]);

  useEffect(() => {
    // Only save the date if the user is considered "signed up"
    if (isHydrated && localStorage.getItem("simushop_has_signed_up") === "true") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentDate));
    }
  }, [currentDate, isHydrated]);
  
  const resetDate = () => {
    setCurrentDate(new Date());
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <DateContext.Provider value={{ currentDate, resetDate }}>
      {children}
    </DateContext.Provider>
  );
}

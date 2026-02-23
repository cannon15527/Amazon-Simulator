"use client";

import type { FinancePlan } from "@/lib/types";
import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
  useContext,
} from "react";
import { z } from "zod";
import { useWallet } from "@/hooks/use-wallet";
import { DateContext } from "@/components/providers/date-provider";
import { useToast } from "@/hooks/use-toast";
import { addMonths } from "date-fns";

interface FinanceContextType {
  plans: FinancePlan[];
  addFinancePlan: (
    orderId: string,
    total: number,
    duration: number,
    interest: number
  ) => void;
}

export const FinanceContext = createContext<FinanceContextType | undefined>(
  undefined
);

const FinancePlanSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  totalAmount: z.number(),
  amountPaid: z.number(),
  monthlyPayment: z.number(),
  paymentsMade: z.number(),
  duration: z.number(),
  interestRate: z.number(),
  nextPaymentDate: z.number(),
  status: z.enum(['Active', 'Paid Off']),
});
const FinancePlanArraySchema = z.array(FinancePlanSchema);

const LOCAL_STORAGE_KEY = "simushop_finance_plans";

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<FinancePlan[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const { deduct } = useWallet();
  const dateContext = useContext(DateContext);
  const currentDate = dateContext?.currentDate;
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedPlans = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPlans) {
        const parsed = FinancePlanArraySchema.safeParse(JSON.parse(storedPlans));
        if(parsed.success) {
            setPlans(parsed.data);
        }
      }
    } catch (error) {
      console.error("Failed to parse finance plans from localStorage", error);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plans));
    }
  }, [plans, isHydrated]);

  const addFinancePlan = (
    orderId: string,
    total: number,
    duration: number,
    interest: number
  ) => {
    if (!currentDate) return;

    const totalWithInterest = total * (1 + interest);
    const monthlyPayment = totalWithInterest / duration;

    const newPlan: FinancePlan = {
      id: crypto.randomUUID(),
      orderId,
      totalAmount: totalWithInterest,
      amountPaid: 0,
      monthlyPayment,
      paymentsMade: 0,
      duration,
      interestRate: interest,
      nextPaymentDate: addMonths(currentDate, 1).getTime(),
      status: "Active",
    };
    setPlans((prev) => [...prev, newPlan]);
  };

  const processPayments = useCallback(() => {
    if (!currentDate) return;

    setPlans((prevPlans) => {
      let hasChanged = false;
      const updatedPlans = prevPlans.map((plan) => {
        if (
          plan.status === "Paid Off" ||
          currentDate.getTime() < plan.nextPaymentDate
        ) {
          return plan;
        }

        // Payment is due
        if (deduct(plan.monthlyPayment)) {
          hasChanged = true;
          const newAmountPaid = plan.amountPaid + plan.monthlyPayment;
          const newPaymentsMade = plan.paymentsMade + 1;

          const isPaidOff = newPaymentsMade >= plan.duration;
          
          toast({
            title: "Affirm Payment Made",
            description: `Your payment of ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(plan.monthlyPayment / 100)} was successful.`,
          });

          return {
            ...plan,
            amountPaid: newAmountPaid,
            paymentsMade: newPaymentsMade,
            nextPaymentDate: addMonths(
              new Date(plan.nextPaymentDate),
              1
            ).getTime(),
            status: isPaidOff ? "Paid Off" : "Active",
          };
        } else {
          toast({
            variant: "destructive",
            title: "Affirm Payment Failed",
            description: "Insufficient funds for your scheduled payment.",
          });
          return plan;
        }
      });
        return hasChanged ? updatedPlans : prevPlans;
    });
  }, [currentDate, deduct, toast]);
  
  useEffect(() => {
      if(isHydrated) {
          processPayments();
      }
  }, [isHydrated, processPayments]);


  if (!isHydrated) return null;

  return (
    <FinanceContext.Provider value={{ plans, addFinancePlan }}>
      {children}
    </FinanceContext.Provider>
  );
}

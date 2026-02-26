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
  status: z.enum(["Active", "Paid Off"]),
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
        const parsed = FinancePlanArraySchema.safeParse(
          JSON.parse(storedPlans)
        );
        if (parsed.success) {
          setPlans(parsed.data as FinancePlan[]);
        }
      }
    } catch (error) {
      console.error(
        "Failed to parse finance plans from localStorage",
        error
      );
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

    const totalWithInterest = Math.round(total * (1 + interest));
    const monthlyPayment = Math.ceil(totalWithInterest / duration);

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

      const updatedPlans: FinancePlan[] = prevPlans.map((plan) => {
        if (
          plan.status === "Paid Off" ||
          currentDate.getTime() < plan.nextPaymentDate
        ) {
          return plan;
        }

        const remainingBalance = plan.totalAmount - plan.amountPaid;
        const paymentAmount = Math.min(plan.monthlyPayment, remainingBalance);

        if (paymentAmount <= 0) {
          if (plan.status === "Active") {
            hasChanged = true;
            return {
              ...plan,
              status: "Paid Off",
              amountPaid: plan.totalAmount,
            };
          }
          return plan;
        }

        if (deduct(paymentAmount)) {
          hasChanged = true;
          const newAmountPaid = plan.amountPaid + paymentAmount;
          const newPaymentsMade = plan.paymentsMade + 1;
          const isPaidOff = newAmountPaid >= plan.totalAmount;

          toast({
            title: "Affirm Payment Made",
            description: `Your payment of ${new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(paymentAmount / 100)} was successful.`,
          });

          return {
            ...plan,
            amountPaid: isPaidOff ? plan.totalAmount : newAmountPaid,
            paymentsMade: newPaymentsMade,
            nextPaymentDate: addMonths(
              new Date(plan.nextPaymentDate),
              1
            ).getTime(),
            status: isPaidOff ? "Paid Off" as const : "Active" as const,
          };
        } else {
          toast({
            variant: "destructive",
            title: "Affirm Payment Failed",
            description:
              "Insufficient funds for your scheduled payment.",
          });
          return plan;
        }
      });

      return hasChanged ? updatedPlans : prevPlans;
    });
  }, [currentDate, deduct, toast]);

  useEffect(() => {
    if (isHydrated) {
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


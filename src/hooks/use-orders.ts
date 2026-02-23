"use client";

import { OrderContext } from "@/components/providers/order-provider";
import { useContext } from "react";

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

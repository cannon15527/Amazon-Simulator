"use client";

import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useContext,
  useCallback,
} from "react";
import { z } from "zod";
import type { Order, CartItem } from "@/lib/types";
import { DateContext } from "@/components/providers/date-provider";
import { addDays, addHours } from "date-fns";

interface OrderContextType {
  orders: Order[];
  placeOrder: (
    items: CartItem[],
    total: number,
    shippingAddress: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
}

export const OrderContext = createContext<OrderContextType | undefined>(
  undefined
);

const OrderSchema = z.object({
  id: z.string(),
  items: z.array(z.any()),
  total: z.number(),
  orderDate: z.number(),
  estimatedDelivery: z.number(),
  status: z.enum(["Processing", "Shipped", "Delivered"]),
  shippingAddress: z.string(), // REQUIRED to match Order type
});

const OrderArraySchema = z.array(OrderSchema);

const LOCAL_STORAGE_KEY = "simushop_orders";

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const dateContext = useContext(DateContext);
  const currentDate = dateContext?.currentDate;

  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedOrders) {
        const parsed = OrderArraySchema.safeParse(JSON.parse(storedOrders));
        if (parsed.success) {
          setOrders(parsed.data as Order[]);
        }
      }
    } catch (error) {
      console.error("Failed to parse orders from localStorage", error);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
    }
  }, [orders, isHydrated]);

  const placeOrder = (
    items: CartItem[],
    total: number,
    shippingAddress: string
  ): Order => {
    const now = currentDate ?? new Date();
    const estimatedDelivery = addDays(now, 2);

    const newOrder: Order = {
      id: crypto.randomUUID(),
      items,
      total,
      orderDate: now.getTime(),
      estimatedDelivery: estimatedDelivery.getTime(),
      status: "Processing",
      shippingAddress,
    };

    setOrders((prev) => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = useCallback(
    (orderId: string, status: Order["status"]) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    },
    []
  );

  useEffect(() => {
    if (!currentDate) return;

    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (
          order.status === "Processing" &&
          currentDate.getTime() >= addHours(order.orderDate, 1).getTime()
        ) {
          return { ...order, status: "Shipped" };
        }

        if (
          order.status === "Shipped" &&
          currentDate.getTime() >= order.estimatedDelivery
        ) {
          return { ...order, status: "Delivered" };
        }

        return order;
      })
    );
  }, [currentDate]);

  if (!isHydrated) return null;

  return (
    <OrderContext.Provider
      value={{ orders, placeOrder, updateOrderStatus }}
    >
      {children}
    </OrderContext.Provider>
  );
}

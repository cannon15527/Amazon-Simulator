"use client";

import type { Order, CartItem, Address } from "@/lib/types";
import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import { z } from "zod";
import { SHIPPING_TIME_NORMAL_SECONDS, SHIPPING_TIME_PRIME_SECONDS, SHIPPING_TIME_PROCESSING_SECONDS } from "@/lib/constants";
import { usePrime } from "@/hooks/use-prime";

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], total: number, address: Address) => void;
}

export const OrderContext = createContext<OrderContextType | undefined>(
  undefined
);

const OrderSchema = z.object({
    id: z.string(),
    items: z.array(z.any()), // Simplified for parsing
    total: z.number(),
    shippingAddress: z.any(), // Simplified for parsing
    status: z.enum(["Processing", "Shipped", "Delivered"]),
    orderDate: z.number(),
    estimatedDelivery: z.number(),
});
const OrderArraySchema = z.array(OrderSchema);


const LOCAL_STORAGE_KEY = "simushop_orders";

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { isPrime } = usePrime();

  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedOrders) {
         const parsed = OrderArraySchema.safeParse(JSON.parse(storedOrders));
        if (parsed.success) {
            setOrders(parsed.data);
        }
      }
    } catch (error) {
      console.error("Failed to parse orders from localStorage", error);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if(isHydrated) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
    }
  }, [orders, isHydrated]);

  const addOrder = (items: CartItem[], total: number, address: Address) => {
    const now = Date.now();
    const shippingTime = isPrime ? SHIPPING_TIME_PRIME_SECONDS : SHIPPING_TIME_NORMAL_SECONDS;
    const newOrder: Order = {
      id: crypto.randomUUID(),
      items,
      total,
      shippingAddress: address,
      status: "Processing",
      orderDate: now,
      estimatedDelivery: now + (shippingTime * 1000),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = useCallback(() => {
    const now = Date.now();
    setOrders(prevOrders => {
        let hasChanged = false;
        const updatedOrders = prevOrders.map(order => {
            if (order.status === 'Delivered') return order;

            const timeSinceOrder = (now - order.orderDate) / 1000;
            const shippingDuration = (order.estimatedDelivery - order.orderDate) / 1000;
            const processingTime = SHIPPING_TIME_PROCESSING_SECONDS;
            
            let newStatus = order.status;
            if (timeSinceOrder >= shippingDuration) {
                newStatus = 'Delivered';
            } else if (timeSinceOrder >= processingTime) {
                newStatus = 'Shipped';
            }

            if (newStatus !== order.status) {
                hasChanged = true;
                return { ...order, status: newStatus };
            }
            return order;
        });

        if (hasChanged) {
            return updatedOrders;
        }
        return prevOrders;
    });
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const interval = setInterval(updateOrderStatus, 1000);
    return () => clearInterval(interval);
  }, [isHydrated, updateOrderStatus]);

  if (!isHydrated) {
    return null;
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

"use client";

import type { Order } from "@/lib/types";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const statuses = ["Processing", "Shipped", "Delivered"];

export function OrderProgress({ order }: { order: Order }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      if (order.status === "Delivered") {
        setProgress(100);
        return;
      }
      if(order.status === "Processing") {
        setProgress(10);
        return;
      }

      const now = Date.now();
      const totalDuration = order.estimatedDelivery - order.orderDate;
      const elapsed = now - order.orderDate;
      const calculatedProgress = Math.min(
        10 + (elapsed / totalDuration) * 90,
        100
      );
      setProgress(calculatedProgress);
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 1000);
    return () => clearInterval(interval);
  }, [order]);

  const currentStatusIndex = statuses.indexOf(order.status);

  return (
    <div className="space-y-4">
      <Progress value={progress} />
      <div className="grid grid-cols-3 gap-4 text-center">
        {statuses.map((status, index) => (
          <div
            key={status}
            className={cn(
              "text-sm",
              index <= currentStatusIndex
                ? "font-semibold text-primary"
                : "text-muted-foreground"
            )}
          >
            <p>{status}</p>
            {status === "Delivered" && (
                <p className="text-xs text-muted-foreground">
                    Est. {format(order.estimatedDelivery, "MMM d")}
                </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

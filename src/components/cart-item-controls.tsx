"use client";

import { useCart } from "@/hooks/use-cart";
import type { CartItem } from "@/lib/types";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";

export function CartItemControls({ item }: { item: CartItem }) {
  const { updateQuantity } = useCart();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center">{item.quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

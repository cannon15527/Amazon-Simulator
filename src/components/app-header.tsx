"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Wallet, Star } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useCart } from "@/hooks/use-cart";
import { usePrime } from "@/hooks/use-prime";
import Link from "next/link";
import { Badge } from "./ui/badge";

export function AppHeader() {
  const { balance } = useWallet();
  const { itemCount } = useCart();
  const { isPrime, timeLeft } = usePrime();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };
  
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '00:00';
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex w-full items-center justify-end gap-4">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm font-medium">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span>{formatCurrency(balance)}</span>
            </div>
            {isPrime && (
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-mono w-12">{formatTime(timeLeft)}</span>
              </div>
            )}
        </div>
        <Button asChild variant="ghost" size="icon" className="relative">
          <Link href="/cart">
            <ShoppingCart />
            {itemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 h-6 w-6 justify-center rounded-full p-0 text-xs"
              >
                {itemCount}
              </Badge>
            )}
            <span className="sr-only">Shopping Cart</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}

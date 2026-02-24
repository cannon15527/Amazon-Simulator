"use client";
import Link from "next/link";
import { ShoppingCart, Wallet, User, Star, Receipt, Calendar } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Badge } from "./ui/badge";
import { usePrime } from "@/hooks/use-prime";
import { useDate } from "@/hooks/use-date";
import { format } from "date-fns";

export function AppHeader() {
  const { balance } = useWallet();
  const { itemCount } = useCart();
  const { isPrime } = usePrime();
  const { currentDate } = useDate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10 items-center">
          <Logo isPrime={isPrime} />
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Shop
            </Link>
            <Link
              href="/orders"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Orders
            </Link>
             <Link
              href="/account/affirm"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Affirm
            </Link>
             <Link
              href="/prime-deals"
              className="flex items-center gap-1 text-sm font-medium text-primary/90 transition-colors hover:text-primary"
            >
              <Star className="w-4 h-4 fill-primary" />
              Prime Deals
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(currentDate, "MMM d, yyyy")}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-medium">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span>{formatCurrency(balance)}</span>
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
            <Button asChild variant="ghost" size="icon">
                <Link href="/account">
                    <User />
                    <span className="sr-only">Account</span>
                </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

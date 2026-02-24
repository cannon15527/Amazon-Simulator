"use client";
import Link from "next/link";
import { ShoppingCart, Wallet, User, Star, Receipt, RefreshCw } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Badge } from "./ui/badge";
import { usePrime } from "@/hooks/use-prime";
import { useDate } from "@/hooks/use-date";
import { format } from "date-fns";

function TopBar() {
  const { currentDate, resetDate } = useDate();
  // Don't render on the server or until hydrated, since date is client-side
  if (!currentDate) return null;

  return (
    <div className="bg-muted/50 text-muted-foreground text-xs text-center py-1.5">
      <div className="container flex items-center justify-center gap-2">
        <span>Today's simulated date is: {format(currentDate, "MMMM d, yyyy")}</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={resetDate} aria-label="Reset date to today">
            <RefreshCw className="h-3 w-3" />
            <span className="sr-only">Reset date</span>
        </Button>
      </div>
    </div>
  );
}


export function AppHeader() {
  const { balance } = useWallet();
  const { itemCount } = useCart();
  const { isPrime } = usePrime();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <TopBar />
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo isPrime={isPrime} />
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Shop
            </Link>
            <Link
              href="/orders"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Orders
            </Link>
            <Link
              href="/account/affirm"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Affirm
            </Link>
             <Link
              href="/prime-deals"
              className="flex items-center gap-1.5 text-sm font-bold text-primary/90 transition-colors hover:text-primary"
            >
              <Star className="w-4 h-4 fill-primary" />
              <span>Prime Deals</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-medium">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span>{formatCurrency(balance)}</span>
            </div>
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
                <Link href="/account">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                </Link>
            </Button>
        </div>
      </div>
    </header>
  );
}

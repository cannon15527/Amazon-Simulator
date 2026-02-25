"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
};

export function MiniCart() {
  const { cart, removeFromCart, cartTotal, itemCount, isAnimating } = useCart();

  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className={cn("relative", isAnimating && "animate-pulse")}>
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
            </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
            <SheetHeader>
            <SheetTitle>Your Cart ({itemCount})</SheetTitle>
            </SheetHeader>
            {cart.length > 0 ? (
                <>
                <ScrollArea className="flex-grow pr-4 -mr-6">
                    <div className="flex flex-col gap-4 py-4">
                    {cart.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-4">
                            <Image
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                width={64}
                                height={48}
                                className="rounded-md object-cover aspect-video"
                            />
                            <div className="flex-grow">
                                <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {item.quantity} x {formatCurrency(item.product.price)}
                                </p>
                            </div>
                             <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeFromCart(item.product.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    </div>
                </ScrollArea>

                <SheetFooter className="flex-col sm:flex-col gap-4 pt-4 border-t">
                    <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Shipping & taxes calculated at checkout.</p>
                    <SheetTrigger asChild>
                        <Button asChild className="w-full">
                            <Link href="/cart">Go to Cart & Checkout</Link>
                        </Button>
                    </SheetTrigger>
                </SheetFooter>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center flex-grow text-center">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                    <p className="mt-4 font-semibold">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">Add some imaginary products!</p>
                </div>
            )}
        </SheetContent>
    </Sheet>
  );
}

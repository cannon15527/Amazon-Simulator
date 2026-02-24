"use client";

import { usePrime } from "@/hooks/use-prime";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Star } from "lucide-react";

export function PrimeSignupPromo() {
  const { subscribe } = usePrime();
  const { toast } = useToast();

  const handlePrimeSignUp = () => {
    if (subscribe()) {
      toast({
        title: "Welcome to Prime!",
        description: "You now get fast, free shipping on all orders.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Subscription Failed",
        description: "You have insufficient funds in your wallet.",
      });
    }
  };

  return (
    <div className="p-3 my-4 bg-secondary/30 rounded-lg text-center border">
      <p className="text-sm font-semibold">
        Sign up for Prime for fast, free shipping!
      </p>
      <p className="text-xs text-muted-foreground mb-2">
        Double-click the button to join instantly.
      </p>
      <Button onDoubleClick={handlePrimeSignUp} size="sm">
        <Star className="mr-2 h-4 w-4" />
        Join Prime
      </Button>
    </div>
  );
}

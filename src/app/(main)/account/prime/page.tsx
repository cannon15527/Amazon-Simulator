"use client";

import { usePrime } from "@/hooks/use-prime";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Rocket, Star, XCircle } from "lucide-react";
import { PRIME_COST } from "@/lib/constants";

export default function PrimePage() {
  const { isPrime, subscribe, unsubscribe } = usePrime();
  const { toast } = useToast();

  const handleSubscribe = () => {
    if (subscribe()) {
      toast({
        title: "Welcome to Prime!",
        description: "You now get expedited virtual shipping.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Subscription Failed",
        description: "You have insufficient funds in your wallet.",
      });
    }
  };
  
  const handleUnsubscribe = () => {
    unsubscribe();
    toast({
        title: "Subscription Cancelled",
        description: "Your SimuShop Prime membership has been cancelled.",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-headline text-2xl font-semibold">SimuShop Prime</h2>
      {isPrime ? (
        <Card className="bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-950/50 dark:to-orange-950/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-8 w-8 text-primary fill-primary" />
              <CardTitle className="font-headline text-2xl">You are a Prime Member!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription>
              Enjoy the best of SimuShop with your Prime membership.
            </CardDescription>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Expedited virtual shipping on all orders.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Exclusive access to non-existent deals.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>The satisfaction of being a premium virtual customer.</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" className="w-full" onClick={handleUnsubscribe}>
                <XCircle className="mr-2 h-5 w-5" />
                Cancel Subscription
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Upgrade to Prime</CardTitle>
            <CardDescription>
              Unlock exclusive benefits, like faster simulated shipping for your virtual goods.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-center p-8 mb-4 bg-secondary rounded-lg">
                <span className="text-4xl font-bold font-headline">{formatCurrency(PRIME_COST)}</span>
                <span className="text-muted-foreground">/minute</span>
            </div>
            <Button className="w-full" size="lg" onClick={handleSubscribe}>
              <Rocket className="mr-2 h-5 w-5" />
              Join SimuShop Prime
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

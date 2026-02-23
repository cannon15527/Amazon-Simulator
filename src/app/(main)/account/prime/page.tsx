"use client";

import { usePrime } from "@/hooks/use-prime";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Rocket, Star, XCircle, Hourglass } from "lucide-react";
import { PRIME_COST } from "@/lib/constants";
import { format } from "date-fns";

export default function PrimePage() {
  const { isPrime, subscribe, unsubscribe, willCancel, renewalDate } = usePrime();
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
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-headline text-2xl font-semibold">Amazon Prime</h2>
      {isPrime ? (
        <Card className="bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-950/50 dark:to-orange-950/50 hover:shadow-2xl hover:shadow-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-8 w-8 text-primary fill-primary" />
              <CardTitle className="font-headline text-2xl">You are a Prime Member!</CardTitle>
            </div>
             {renewalDate && !willCancel && (
              <CardDescription>
                Your membership will renew on {format(renewalDate, 'MMMM d, yyyy')}.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
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
               {willCancel && renewalDate && (
                <li className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <Hourglass className="h-5 w-5" />
                    <span>Your subscription will be cancelled on {format(renewalDate, 'MMMM d, yyyy')}.</span>
                </li>
               )}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" className="w-full" onClick={handleUnsubscribe} disabled={willCancel}>
                {willCancel ? (
                    <>
                        <Hourglass className="mr-2 h-5 w-5" />
                        Cancellation Pending
                    </>
                ) : (
                    <>
                        <XCircle className="mr-2 h-5 w-5" />
                        Cancel Subscription
                    </>
                )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="hover:shadow-lg hover:shadow-accent/10">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Upgrade to Prime</CardTitle>
            <CardDescription>
              Unlock exclusive benefits, like faster simulated shipping for your virtual goods.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-center p-8 mb-4 bg-secondary rounded-lg">
                <span className="text-4xl font-bold font-headline">{formatCurrency(PRIME_COST)}</span>
                <span className="text-muted-foreground">/month</span>
            </div>
            <Button className="w-full" size="lg" onClick={handleSubscribe}>
              <Rocket className="mr-2 h-5 w-5" />
              Join Amazon Prime
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

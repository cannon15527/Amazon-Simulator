"use client";

import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ProcessingOverlay } from "@/components/processing-overlay";

export default function WalletPage() {
  const { balance, addFunds } = useWallet();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
  };

  const handleAddFunds = (amount: number) => {
    setIsProcessing(true);

    setTimeout(() => {
      addFunds(amount);
      toast({
        title: "Funds Added",
        description: `${formatCurrency(amount)} has been added to your wallet.`,
      });
      setIsProcessing(false);
    }, 2000);
  };
  
  const fundAmounts = [1000, 2000, 5000, 10000];

  return (
    <>
      <ProcessingOverlay show={isProcessing} />
      <div className="space-y-6">
        <h2 className="font-headline text-2xl font-semibold">Your Wallet</h2>
        <Card>
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
            <CardDescription>This is your available balance for virtual purchases.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center p-8 bg-secondary rounded-lg">
              <span className="text-5xl font-bold font-headline">{formatCurrency(balance)}</span>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                  <PlusCircle className="h-5 w-5 text-muted-foreground"/>
                  <h3 className="text-lg font-semibold">Add Funds</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">It's not real money, so go wild. Select an amount to add to your wallet.</p>
              <div className="flex flex-wrap justify-start gap-4">
                {fundAmounts.map((amount) => (
                  <Button 
                    key={amount}
                    onClick={() => handleAddFunds(amount)} 
                    size="lg" 
                    variant="outline"
                    disabled={isProcessing}
                  >
                    Add {formatCurrency(amount)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

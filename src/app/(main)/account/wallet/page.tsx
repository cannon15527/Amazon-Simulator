"use client";

import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ProcessingOverlay } from "@/components/processing-overlay";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const customAmountSchema = z.object({
    amount: z.coerce
        .number({ invalid_type_error: "Please enter a valid number." })
        .positive("Amount must be positive.")
        .max(10000, "You can't add more than $10,000 at a time."),
});


export default function WalletPage() {
  const { balance, addFunds } = useWallet();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCustomAmountOpen, setIsCustomAmountOpen] = useState(false);

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
  
  const form = useForm<z.infer<typeof customAmountSchema>>({
    resolver: zodResolver(customAmountSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  function onCustomAmountSubmit(values: z.infer<typeof customAmountSchema>) {
    const amountInCents = Math.round(values.amount * 100);
    handleAddFunds(amountInCents);
    setIsCustomAmountOpen(false);
    form.reset();
  }

  const fundAmounts = [2000, 5000, 10000, 25000];

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
                 <Dialog open={isCustomAmountOpen} onOpenChange={setIsCustomAmountOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            size="lg" 
                            variant="secondary"
                            disabled={isProcessing}
                        >
                            <DollarSign className="mr-2" />
                            Add Custom Amount
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a custom amount</DialogTitle>
                            <DialogDescription>
                                Enter the amount in dollars you'd like to add to your wallet.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onCustomAmountSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Amount ($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="e.g., 42.50" {...field} step="0.01" />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit" className="w-full">
                                        Add to Wallet
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

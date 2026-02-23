"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreditCard, Wallet, ExternalLink, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";


const cardFormSchema = z.object({
  cardNumber: z.string().regex(/^(?:\d{16})$/, {message: "Must be 16 digits."}).transform(val => val.replace(/\s/g, '')),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/, "MM/YY format required."),
  cvc: z.string().regex(/^\d{3,4}$/, "Must be 3 or 4 digits."),
  nameOnCard: z.string().min(2, "Name is required."),
});

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPaymentSuccess: () => void;
  total: number;
}

export function PaymentDialog({ isOpen, onOpenChange, onPaymentSuccess, total }: PaymentDialogProps) {
  const router = useRouter();
  const showFinancing = total > 5000; // $50 in cents

  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      nameOnCard: "",
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
  };
  
  function onCardSubmit(values: z.infer<typeof cardFormSchema>) {
    onPaymentSuccess();
    onOpenChange(false);
  }

  function handlePayPalRedirect() {
    router.push(`/paypal-checkout?total=${total}`);
  }

  function handleFinanceRedirect() {
    router.push(`/finance-checkout?total=${total}`);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            Total amount to pay: <span className="font-bold text-foreground">{formatCurrency(total)}</span>
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="card" className="w-full">
          <TabsList className={cn("grid w-full", showFinancing ? "grid-cols-3" : "grid-cols-2")}>
            <TabsTrigger value="card">
              <CreditCard className="mr-2 h-4 w-4" /> Card
            </TabsTrigger>
            <TabsTrigger value="paypal">
              <Wallet className="mr-2 h-4 w-4" /> PayPal
            </TabsTrigger>
            {showFinancing && (
                <TabsTrigger value="finance">
                    <Landmark className="mr-2 h-4 w-4" /> Affirm
                </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="card">
            <Form {...cardForm}>
              <form onSubmit={cardForm.handleSubmit(onCardSubmit)} className="space-y-4 pt-4">
                 <FormField
                  control={cardForm.control}
                  name="nameOnCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name on Card</FormLabel>
                      <FormControl>
                        <Input placeholder="John M. Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={cardForm.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1111222233334444" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                    <FormField
                    control={cardForm.control}
                    name="expiryDate"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>Expiry (MM/YY)</FormLabel>
                        <FormControl>
                            <Input placeholder="12/28" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={cardForm.control}
                    name="cvc"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>CVC</FormLabel>
                        <FormControl>
                            <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <Button type="submit" className="w-full">
                  Pay {formatCurrency(total)}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="paypal">
             <div className="space-y-4 pt-4 text-center">
              <p className="text-sm text-muted-foreground">You'll be redirected to PayPal to complete your purchase securely.</p>
              <Button type="button" className="w-full" size="lg" onClick={handlePayPalRedirect}>
                <ExternalLink className="mr-2" />
                Sign in on external website
              </Button>
             </div>
          </TabsContent>
           {showFinancing && (
            <TabsContent value="finance">
                <div className="space-y-4 pt-4 text-center">
                    <p className="text-sm text-muted-foreground">You'll be redirected to Affirm to set up a payment plan.</p>
                    <Button type="button" className="w-full" size="lg" onClick={handleFinanceRedirect}>
                        <ExternalLink className="mr-2" />
                        Continue with Affirm
                    </Button>
                </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

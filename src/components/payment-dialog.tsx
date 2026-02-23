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
import { CreditCard, Wallet, Loader2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";


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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
  
  const handlePayment = () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
          console.log("Card payment submitted");
          onPaymentSuccess();
          setIsLoading(false);
          onOpenChange(false); // Close dialog on success
      }, 1500);
  }

  function onCardSubmit(values: z.infer<typeof cardFormSchema>) {
    handlePayment();
  }

  function handlePayBudRedirect() {
    router.push(`/paybud-checkout?total=${total}`);
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">
              <CreditCard className="mr-2 h-4 w-4" /> Card
            </TabsTrigger>
            <TabsTrigger value="paybud">
              <Wallet className="mr-2 h-4 w-4" /> PayBud
            </TabsTrigger>
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
                        <Input placeholder="John M. Doe" {...field} disabled={isLoading} />
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
                        <Input placeholder="1111222233334444" {...field} disabled={isLoading}/>
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
                            <Input placeholder="12/28" {...field} disabled={isLoading}/>
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
                            <Input placeholder="123" {...field} disabled={isLoading}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Pay {formatCurrency(total)}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="paybud">
             <div className="space-y-4 pt-4 text-center">
              <p className="text-sm text-muted-foreground">You'll be redirected to PayBud to complete your purchase securely.</p>
              <Button type="button" className="w-full" size="lg" onClick={handlePayBudRedirect}>
                <ExternalLink className="mr-2" />
                Sign in on external website
              </Button>
             </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

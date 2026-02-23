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
import { CreditCard, Wallet } from "lucide-react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const cardFormSchema = z.object({
  cardNumber: z.string().regex(/^(?:\d{16})$/, {message: "Must be 16 digits."}).transform(val => val.replace(/\s/g, '')),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/, "MM/YY format required."),
  cvc: z.string().regex(/^\d{3,4}$/, "Must be 3 or 4 digits."),
  nameOnCard: z.string().min(2, "Name is required."),
});

const payBudFormSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPaymentSuccess: () => void;
  total: number;
}

export function PaymentDialog({ isOpen, onOpenChange, onPaymentSuccess, total }: PaymentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const cardForm = useForm<z.infer<typeof cardFormSchema>>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      nameOnCard: "",
    },
  });

  const payBudForm = useForm<z.infer<typeof payBudFormSchema>>({
    resolver: zodResolver(payBudFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
  };
  
  const handlePayment = (paymentType: string) => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
          console.log(`${paymentType} payment submitted`);
          onPaymentSuccess();
          setIsLoading(false);
          onOpenChange(false); // Close dialog on success
      }, 1500);
  }

  function onCardSubmit(values: z.infer<typeof cardFormSchema>) {
    handlePayment("Card");
  }

  function onPayBudSubmit(values: z.infer<typeof payBudFormSchema>) {
    handlePayment("PayBud");
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
             <Form {...payBudForm}>
              <form onSubmit={payBudForm.handleSubmit(onPayBudSubmit)} className="space-y-4 pt-4">
                 <FormField
                  control={payBudForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PayBud Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} disabled={isLoading}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={payBudForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} disabled={isLoading}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In & Pay {formatCurrency(total)}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

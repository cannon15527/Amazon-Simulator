
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
import { Badge } from "./ui/badge";


const cardFormSchema = z.object({
  cardNumber: z.string().regex(/^(?:\d{16})$/, {message: "Must be 16 digits."}).transform(val => val.replace(/\s/g, '')),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/, "MM/YY format required."),
  cvc: z.string().regex(/^\d{3,4}$/, "Must be 3 or 4 digits."),
  nameOnCard: z.string().min(2, "Name is required."),
});

function GooglePayIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24"
            {...props}
        >
            <path
            fill="#4285F4"
            d="M22.5 8.63h-2.05a3.29 3.29 0 0 0-3.15-2.27V4.22a5.43 5.43 0 0 1 5.2 4.41z"
            ></path>
            <path
            fill="#34A853"
            d="M22.5 15.37h-2.05a3.29 3.29 0 0 1-3.15 2.27v2.14a5.43 5.43 0 0 0 5.2-4.41z"
            ></path>
            <path
            fill="#FBBC04"
            d="M4.05 6.37A3.29 3.29 0 0 1 7.2 4.1V1.95a5.43 5.43 0 0 0-5.2 4.42h2.05z"
            ></path>
            <path
            fill="#EA4335"
            d="M4.05 17.63a3.29 3.29 0 0 0 3.15 2.27v2.15a5.43 5.43 0 0 1-5.2-4.42h2.05z"
            ></path>
            <path
            fill="#1A73E8"
            d="M19.18 10.37H7.1a2.15 2.15 0 0 0-2.15 2.15v.51a2.15 2.15 0 0 0 2.15 2.15h12.08a2.15 2.15 0 0 0 2.15-2.15v-.51a2.15 2.15 0 0 0-2.15-2.15z"
            ></path>
        </svg>
    );
}

function ApplePayIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 128 128"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M107.49 86.43a29.44 29.44 0 0 1-13.8-2.65c-4.41-1.8-8.29-4.22-11.4-6.19-3.23-2.09-5.9-4-8.7-4s-5.47 1.91-8.7 4c-3.11 1.97-7 4.39-11.4 6.19a29.44 29.44 0 0 1-13.8 2.65C23.63 87.26 8.51 73.47 8.51 52.79c0-11.33 4.67-21.24 12.38-27.93a29.4 29.4 0 0 1 23.95-10.15c7.65 0 12.4 3.23 16.27 3.23s8.62-3.23 16.27-3.23a29.4 29.4 0 0 1 23.95 10.15c7.71 6.69 12.38 16.6 12.38 27.93 0 20.68-15.12 34.47-31.17 33.64zm-37.4-70.5c3.84-4.8 3.51-12.06-1-15.93-5-4.21-12.39-3.49-17.19 1.3-4.42 4.41-4.75 11.29-.87 16.1 4.54 4.54 11.66 4.1 16.32-1.3A2.43 2.43 0 0 1 70.09 15.93z"
                fill='currentColor'
            ></path>
        </svg>
    )
}

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPaymentSuccess: () => void;
  total: number;
  onPayPalClick?: () => void;
  onFinanceClick?: () => void;
  onGooglePayClick?: () => void;
  onApplePayClick?: () => void;
}

export function PaymentDialog({ isOpen, onOpenChange, onPaymentSuccess, total, onPayPalClick, onFinanceClick, onGooglePayClick, onApplePayClick }: PaymentDialogProps) {
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
    if (onPayPalClick) {
      onPayPalClick();
    } else {
      router.push(`/paypal-checkout?total=${total}`);
    }
  }

  function handleFinanceRedirect() {
    if (onFinanceClick) {
      onFinanceClick();
    } else {
      router.push(`/finance-checkout?total=${total}`);
    }
  }
  
  function handleGooglePayRedirect() {
    if (onGooglePayClick) {
        onGooglePayClick();
    } else {
        router.push(`/google-pay-checkout?total=${total}`);
    }
  }

  function handleApplePayRedirect() {
    if (onApplePayClick) {
        onApplePayClick();
    } else {
        router.push(`/apple-pay-checkout?total=${total}`);
    }
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
        <Tabs defaultValue="google-pay" className="w-full">
          <TabsList className="w-full h-auto flex-wrap justify-start">
             <TabsTrigger value="google-pay">
               <div className="flex items-center gap-2">
                 <GooglePayIcon className="h-4 w-4" />
                 <span>G Pay</span>
                 <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5">Recommended</Badge>
               </div>
            </TabsTrigger>
            <TabsTrigger value="apple-pay">
               <div className="flex items-center gap-2">
                 <ApplePayIcon className="h-5 w-5" />
                 <span>Apple Pay</span>
               </div>
            </TabsTrigger>
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
           <TabsContent value="google-pay">
             <div className="space-y-4 pt-4 text-center">
              <p className="text-sm text-muted-foreground">The fastest and most secure way to pay. You'll be redirected to complete your purchase.</p>
              <Button type="button" className="w-full" size="lg" onClick={handleGooglePayRedirect}>
                <ExternalLink className="mr-2" />
                Continue with Google Pay
              </Button>
             </div>
          </TabsContent>
          <TabsContent value="apple-pay">
             <div className="space-y-4 pt-4 text-center">
              <p className="text-sm text-muted-foreground">Pay with Apple Pay for a fast and secure checkout. You'll be redirected to complete your purchase.</p>
              <Button type="button" className="w-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200" size="lg" onClick={handleApplePayRedirect}>
                <ExternalLink className="mr-2" />
                Continue with Apple Pay
              </Button>
             </div>
          </TabsContent>
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
                Continue with PayPal
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

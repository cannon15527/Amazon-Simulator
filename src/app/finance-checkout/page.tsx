'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(1, "Password cannot be empty."),
});

const verificationSchema = z.object({
    code: z.string().length(6, "Please enter a 6-digit code."),
});


// Fictional financing plans
const financePlans = [
    { id: '1', duration: 3, interest: '0% APR' },
    { id: '2', duration: 6, interest: '4.99% APR' },
    { id: '3', duration: 12, interest: '9.99% APR' },
];

export default function FinanceCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const [step, setStep] = useState<'login' | 'verification' | 'plan-selection'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const returnContext = searchParams.get('return_context');

  useEffect(() => {
    const totalParam = searchParams.get('total');
    if (totalParam) {
      setTotal(Number(totalParam));
    }
  }, [searchParams]);
  
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);
  };

  const getMonthlyPayment = (planId: string) => {
      const plan = financePlans.find(p => p.id === planId);
      if (!plan) return 0;
      const interestRate = parseFloat(plan.interest) / 100;
      const monthlyTotal = (total * (1 + interestRate)) / plan.duration;
      return monthlyTotal;
  }

  function onLoginSubmit(values: z.infer<typeof loginFormSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      setStep('verification');
      setIsLoading(false);
    }, 2000);
  }
  
  function onVerificationSubmit(values: z.infer<typeof verificationSchema>) {
    setIsLoading(true);
    setTimeout(() => {
        setStep('plan-selection');
        setIsLoading(false);
    }, 1000);
  }

  const handlePlanSelection = (planId: string) => {
    setIsLoading(true);
    setSelectedPlanId(planId);
    const plan = financePlans.find(p => p.id === planId);
    if (!plan) return;

    const interestRate = parseFloat(plan.interest) / 100;

    setTimeout(() => {
        let redirectUrl = `/cart?finance_success=true&total=${total}&duration=${plan.duration}&interest=${interestRate}`;
        if (returnContext) {
            redirectUrl += `&return_context=${returnContext}`;
        }
        router.push(redirectUrl);
    }, 2000);
  };

  const handleCancel = () => {
    router.push('/cart');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-purple-50 dark:bg-purple-950/20 p-4">
       <div className="absolute top-4 left-4">
            <Button variant="ghost" onClick={handleCancel}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Amazon
            </Button>
        </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-600 text-white mb-4">
                <Landmark className="h-6 w-6" />
            </div>
          <CardTitle className="text-3xl font-bold text-purple-800 dark:text-purple-300">Affirm</CardTitle>
          <CardDescription>You are financing your purchase from Amazon</CardDescription>
        </CardHeader>
        
        {step === 'login' && (
            <CardContent className="space-y-6">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-5xl font-bold">{formatCurrency(total)}</p>
                </div>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="you@affirm.com" {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="lg" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In & Authorize
                        </Button>
                    </form>
                 </Form>
            </CardContent>
        )}

        {step === 'verification' && (
            <CardContent>
                <div className="text-center mb-6">
                    <ShieldCheck className="mx-auto h-10 w-10 text-purple-600 mb-2"/>
                    <h3 className="text-xl font-semibold">Enter Verification Code</h3>
                    <p className="text-sm text-muted-foreground mt-1">A code was sent to your email. For this demo, any 6 digits will work.</p>
                </div>
                <Form {...verificationForm}>
                    <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-4">
                        <FormField
                            control={verificationForm.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>6-Digit Code</FormLabel>
                                <FormControl>
                                    <Input type="text" inputMode="numeric" placeholder="123456" {...field} disabled={isLoading} maxLength={6} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="lg" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify & Continue
                        </Button>
                    </form>
                </Form>
            </CardContent>
        )}

        {step === 'plan-selection' && (
            <>
            <CardHeader className="pt-2">
                <CardTitle className="text-xl text-center">Select your payment plan</CardTitle>
                <CardDescription className="text-center">Choose a plan for your {formatCurrency(total)} purchase.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {financePlans.map(plan => (
                    <Button 
                        key={plan.id} 
                        variant="outline" 
                        className="w-full justify-between h-16" 
                        size="lg" 
                        onClick={() => handlePlanSelection(plan.id)}
                        disabled={isLoading}
                    >
                        {isLoading && selectedPlanId === plan.id ? (
                            <Loader2 className="mr-4 animate-spin" />
                        ) : (
                           <div className="flex items-center">
                             <div className="text-left">
                                <p className="font-semibold">{plan.duration} months</p>
                                <p className="text-sm text-muted-foreground">{plan.interest}</p>
                            </div>
                           </div>
                        )}
                        <div className="text-right">
                            <p className="font-semibold">{formatCurrency(getMonthlyPayment(plan.id))}/mo</p>
                        </div>
                    </Button>
                ))}
            </CardContent>
            </>
        )}
      </Card>
    </div>
  );
}

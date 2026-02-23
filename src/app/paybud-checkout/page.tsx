'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PayBudCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const totalParam = searchParams.get('total');
    if (totalParam) {
      setTotal(Number(totalParam));
    }
  }, [searchParams]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);
  };

  const handleSignIn = () => {
    // Redirect back to cart with a success flag
    router.push('/cart?paybud_success=true');
  };

  const handleCancel = () => {
    router.push('/cart');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-blue-50 dark:bg-blue-950/20 p-4">
       <div className="absolute top-4 left-4">
            <Button variant="ghost" onClick={handleCancel}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to SimuShop
            </Button>
        </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white mb-4">
                <Wallet className="h-6 w-6" />
            </div>
          <CardTitle className="text-3xl font-bold text-blue-800 dark:text-blue-300">PayBud</CardTitle>
          <CardDescription>You are paying SimuShop Prime</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-5xl font-bold">{formatCurrency(total)}</p>
            </div>
            <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-center text-sm text-blue-700 dark:text-blue-300">
                You will be redirected back to SimuShop to complete your purchase after signing in.
            </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg" onClick={handleSignIn}>
            Sign In & Authorize Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

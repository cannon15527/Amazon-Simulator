
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Loader2, Fingerprint } from 'lucide-react';
import { useEffect, useState } from 'react';

function ApplePayIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="48"
            height="48"
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

export default function ApplePayCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const returnContext = searchParams.get('return_context');
  const userName = typeof window !== 'undefined' ? localStorage.getItem("simushop_user_name") || "Jane Doe" : "Jane Doe";

  useEffect(() => {
    const totalParam = searchParams.get('total');
    if (totalParam) {
      setTotal(Number(totalParam));
    }
  }, [searchParams]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);
  };
  
  const handlePayment = () => {
    setIsLoading(true);
    setTimeout(() => {
        let redirectUrl = '/cart?apple_pay_success=true';
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 dark:bg-black p-4">
       <div className="absolute top-4 left-4">
            <Button variant="ghost" onClick={handleCancel} className="text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Amazon
            </Button>
        </div>
      <Card className="w-full max-w-sm shadow-2xl bg-white dark:bg-black text-black dark:text-white border-zinc-300 dark:border-zinc-800">
        <CardHeader className="text-center pb-4">
            <div className="mx-auto flex items-center justify-center mb-4 text-black dark:text-white">
                <ApplePayIcon />
            </div>
          <CardTitle className="text-xl">Pay with Apple Pay</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">Amazon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold mt-1">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
            </div>
            <div className="text-sm space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Paying with</p>
                <p>Visa •••• 1234</p>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <Button onClick={handlePayment} className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200" size="lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Processing..." : (
                    <>
                        <Fingerprint className="mr-2"/>
                        Pay with Touch ID
                    </>
                )}
            </Button>
             <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                This is a secure payment.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

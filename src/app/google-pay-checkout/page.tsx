
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

function GooglePayIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
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

export default function GooglePayCheckoutPage() {
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
        let redirectUrl = '/cart?google_pay_success=true';
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
       <div className="absolute top-4 left-4">
            <Button variant="ghost" onClick={handleCancel}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Amazon
            </Button>
        </div>
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center pb-2">
            <div className="mx-auto flex items-center justify-center mb-4">
                <GooglePayIcon className="h-8 w-8" />
            </div>
          <CardTitle className="text-xl">Pay with Google</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border bg-background">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Paying</span>
                    <span>Amazon Simulator</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold mt-1">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </div>
            
            <div className="text-sm space-y-2">
                <p className="font-medium">Paying as</p>
                <p className="text-muted-foreground">{userName}</p>
            </div>
             <div className="text-sm space-y-2">
                <p className="font-medium">Payment method</p>
                <p className="text-muted-foreground">Visa •••• 1234</p>
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handlePayment} className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Processing..." : `Pay ${formatCurrency(total)}`}
            </Button>
        </CardFooter>
        <p className="text-xs text-muted-foreground text-center p-4 pt-0">
          <ShieldCheck className="inline h-3 w-3 mr-1" />
          Secured by Google. This is a simulation.
        </p>
      </Card>
    </div>
  );
}

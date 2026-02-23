"use client";

import { useFinance } from "@/hooks/use-finance";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Receipt } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AffirmPage() {
  const { plans } = useFinance();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const activePlans = plans.filter(p => p.status === 'Active');
  const paidOffPlans = plans.filter(p => p.status === 'Paid Off');

  return (
    <div className="space-y-6">
       <h2 className="font-headline text-2xl font-semibold">Affirm Payments</h2>

      {plans.length === 0 ? (
        <Card className="text-center py-16 border-dashed">
          <CardHeader>
            <Receipt className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4">No Financing Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You haven't financed any orders yet.</p>
          </CardContent>
           <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">Active Plans</h3>
                {activePlans.length > 0 ? (
                    <div className="space-y-4">
                        {activePlans.map((plan) => (
                            <Card key={plan.id}>
                                <CardHeader className="flex flex-row items-start justify-between gap-4">
                                    <div>
                                        <CardTitle>Order #{plan.orderId.substring(0, 8)}...</CardTitle>
                                        <CardDescription>
                                            {plan.duration} month plan at {(plan.interestRate * 100).toFixed(2)}% APR
                                        </CardDescription>
                                    </div>
                                    <Badge>Active</Badge>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Progress value={(plan.amountPaid / plan.totalAmount) * 100} />
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>{formatCurrency(plan.amountPaid)} paid</span>
                                            <span>{formatCurrency(plan.totalAmount)} total</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col items-start bg-secondary/30 p-4">
                                    <p className="text-sm font-medium">Next Payment:</p>
                                    <p className="text-sm text-muted-foreground">{formatCurrency(plan.monthlyPayment)} due on {format(plan.nextPaymentDate, "MMMM d, yyyy")}</p>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">No active financing plans.</p>
                )}
            </div>

             <div>
                <h3 className="text-lg font-semibold mb-4">Paid Off Plans</h3>
                {paidOffPlans.length > 0 ? (
                    <div className="space-y-4">
                       {paidOffPlans.map((plan) => (
                            <Card key={plan.id} className="opacity-70">
                                <CardHeader className="flex flex-row items-start justify-between gap-4">
                                    <div>
                                        <CardTitle>Order #{plan.orderId.substring(0, 8)}...</CardTitle>
                                        <CardDescription>
                                            {plan.duration} month plan
                                        </CardDescription>
                                    </div>
                                    <Badge variant="secondary">Paid Off</Badge>
                                </CardHeader>
                                <CardContent>
                                     <div className="flex justify-between text-sm">
                                        <span>Total Paid</span>
                                        <span>{formatCurrency(plan.totalAmount)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                     <p className="text-muted-foreground text-sm">No paid off plans yet.</p>
                )}
            </div>
        </div>
      )}
    </div>
  );
}

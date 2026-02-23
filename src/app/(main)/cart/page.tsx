"use client";

import { useCart } from "@/hooks/use-cart";
import { useWallet } from "@/hooks/use-wallet";
import { useOrders } from "@/hooks/use-orders";
import { useAddresses } from "@/hooks/use-addresses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { AlertCircle, CreditCard, ShoppingBag, Trash2 } from "lucide-react";
import { CartItemControls } from "@/components/cart-item-controls";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PaymentDialog } from "@/components/payment-dialog";
import { ProcessingOverlay } from "@/components/processing-overlay";
import { SALES_TAX_RATE } from "@/lib/constants";
import { useFinance } from "@/hooks/use-finance";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
};

export default function CartPage() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  const { balance, deduct } = useWallet();
  const { addOrder } = useOrders();
  const { addresses, getDefaultAddress } = useAddresses();
  const { toast } = useToast();
  const { addFinancePlan } = useFinance();
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'processing' | 'success' | 'declined'>('processing');
  const searchParams = useSearchParams();
  const router = useRouter();
  const processingRef = useRef(false);

  const taxAmount = cartTotal * SALES_TAX_RATE;
  const orderTotal = cartTotal + taxAmount;
  
  const processOrder = useCallback(() => {
    if (cart.length === 0) return;

    const shippingAddress = addresses.find(a => a.id === selectedAddressId);
    if (!shippingAddress) {
      toast({ variant: "destructive", title: "No shipping address", description: "Please add or select a shipping address." });
      return;
    }

    addOrder(cart, orderTotal, shippingAddress);
    clearCart();
    toast({ title: "Purchase Complete!", description: "Your virtual order has been placed." });
  }, [cart, orderTotal, addresses, selectedAddressId, addOrder, clearCart, toast]);

  useEffect(() => {
    const defaultAddress = getDefaultAddress();
    if (!selectedAddressId && defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, [addresses, getDefaultAddress, selectedAddressId]);
  
 useEffect(() => {
    const paypalSuccess = searchParams.get('paypal_success') === 'true';
    const financeSuccess = searchParams.get('finance_success') === 'true';
    const planDuration = searchParams.get('duration');
    const planInterest = searchParams.get('interest');
    const planTotal = searchParams.get('total');

    if ((paypalSuccess || financeSuccess) && cart.length > 0 && selectedAddressId && !processingRef.current) {
      processingRef.current = true;
      setIsProcessing(true);
      setProcessingStatus('processing');
      router.replace('/cart', { scroll: false });
      
      setTimeout(() => {
        const shippingAddress = addresses.find(a => a.id === selectedAddressId);

        if (financeSuccess) {
            if (!shippingAddress || !planDuration || !planInterest || !planTotal) {
                setProcessingStatus('declined');
                 toast({ variant: "destructive", title: "Financing Failed", description: "Missing plan details." });
                 setTimeout(() => {
                    setIsProcessing(false);
                    processingRef.current = false;
                }, 2000);
                return;
            }
            const newOrder = addOrder(cart, orderTotal, shippingAddress);
            addFinancePlan(newOrder.id, Number(planTotal), Number(planDuration), Number(planInterest));
            clearCart();
            setProcessingStatus('success');
            toast({ title: "Financing Approved!", description: "Check status in the Affirm tab." });
        } else { // PayPal
            if (balance < orderTotal) {
                setProcessingStatus('declined');
                toast({
                    variant: "destructive",
                    title: "Transaction Declined",
                    description: `You have insufficient funds. You need ${formatCurrency(orderTotal)}.`,
                });
            } else {
                deduct(orderTotal);
                processOrder();
                setProcessingStatus('success');
            }
        }
        
        setTimeout(() => {
            setIsProcessing(false);
            processingRef.current = false;
        }, 2000);

      }, 3000);
    }
  }, [searchParams, cart, selectedAddressId, processOrder, router, balance, orderTotal, toast, addresses, addFinancePlan, addOrder, clearCart, deduct]);


  const handleCheckoutClick = () => {
      if (!selectedAddressId) {
        toast({ variant: "destructive", title: "No shipping address", description: "Please add or select a shipping address to continue." });
        return;
      }
      setIsPaymentDialogOpen(true);
  }

  const handleCardPayment = () => {
    setIsProcessing(true);
    setProcessingStatus('processing');

    setTimeout(() => {
      if (balance < orderTotal) {
        setProcessingStatus('declined');
        toast({
          variant: "destructive",
          title: "Transaction Declined",
          description: `You have insufficient funds. You need ${formatCurrency(orderTotal)}.`,
        });
        setTimeout(() => setIsProcessing(false), 2000);
      } else {
        deduct(orderTotal);
        processOrder();
        setProcessingStatus('success');
        setTimeout(() => setIsProcessing(false), 2000);
      }
    }, 3000);
  };

  return (
    <>
    <ProcessingOverlay show={isProcessing} status={processingStatus} />
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Shopping Cart</h1>
      </div>
      {cart.length === 0 ? (
        <Card className="text-center py-16">
          <CardHeader>
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4">Your cart is empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {cart.map((item) => (
                    <li key={item.product.id} className="flex items-center gap-4 p-4">
                      <Image src={item.product.imageUrl} alt={item.product.name} width={96} height={64} className="rounded-md aspect-video object-cover" />
                      <div className="flex-grow">
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(item.product.price)}</p>
                      </div>
                      <CartItemControls item={item} />
                      <div className="w-20 text-right font-semibold">
                        {formatCurrency(item.product.price * item.quantity)}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax ({(SALES_TAX_RATE * 100).toFixed(1)}%)</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(orderTotal)}</span>
                </div>
                 <Separator />
                 <div>
                    <h3 className="text-sm font-medium mb-2">Shipping Address</h3>
                    {addresses.length > 0 ? (
                        <Select value={selectedAddressId} onValueChange={setSelectedAddressId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an address" />
                            </SelectTrigger>
                            <SelectContent>
                                {addresses.map(addr => (
                                    <SelectItem key={addr.id} value={addr.id}>{addr.name} - {addr.street}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                         <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>No Address Found</AlertTitle>
                          <AlertDescription>
                            <Link href="/account/addresses" className="underline font-semibold">Add an address</Link> to continue.
                          </AlertDescription>
                        </Alert>
                    )}
                 </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={handleCheckoutClick} disabled={!selectedAddressId}>
                  <CreditCard className="mr-2" />
                  Place Virtual Order
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
    <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        onPaymentSuccess={handleCardPayment}
        total={orderTotal}
    />
    </>
  );
}

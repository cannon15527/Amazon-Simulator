"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Zap, CreditCard, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { useOrders } from "@/hooks/use-orders";
import { useAddresses } from "@/hooks/use-addresses";
import { SALES_TAX_RATE } from "@/lib/constants";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import Link from "next/link";
import { PaymentDialog } from "./payment-dialog";
import { ProcessingOverlay } from "./processing-overlay";

interface ProductDetailProps {
  product: Product;
  originalPrice?: number;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
};

export function ProductDetail({ product, originalPrice, onClose }: ProductDetailProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  
  const [view, setView] = useState<'detail' | 'checkout'>('detail');
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'processing' | 'success' | 'declined'>('processing');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  const { addresses, getDefaultAddress } = useAddresses();
  const { balance, deduct } = useWallet();
  const { addOrder } = useOrders();

  const taxAmount = product.price * SALES_TAX_RATE;
  const orderTotal = product.price + taxAmount;

  useEffect(() => {
    const defaultAddress = getDefaultAddress();
    if (view === 'checkout' && !selectedAddressId && defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
    }
  }, [view, addresses, getDefaultAddress, selectedAddressId]);
  
  const processOrder = () => {
    const shippingAddress = addresses.find(a => a.id === selectedAddressId);
    if (!shippingAddress) return; 

    const singleItemCart = [{ product, quantity: 1 }];
    addOrder(singleItemCart, orderTotal, shippingAddress);
    toast({ title: "Purchase Complete!", description: "Your virtual order has been placed." });
    onClose();
  };
  
  const handleCardPayment = () => {
    setIsPaymentDialogOpen(false);
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
            setTimeout(() => {
                setIsProcessing(false);
                onClose();
                router.push('/orders'); 
            }, 2000);
        }
    }, 3000);
  };
  
  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      toast({ variant: "destructive", title: "No shipping address", description: "Please add or select a shipping address to continue." });
      return;
    }
    setIsPaymentDialogOpen(true);
  };

  const handleExternalPaymentRedirect = (paymentType: 'paypal' | 'finance') => {
     if (!selectedAddressId) return;
     const context = {
         productId: product.id,
         addressId: selectedAddressId,
         total: orderTotal,
     }
     localStorage.setItem('quick_checkout_context', JSON.stringify(context));
     const url = paymentType === 'paypal' ? `/paypal-checkout?total=${orderTotal}&return_context=quick-checkout` : `/finance-checkout?total=${orderTotal}&return_context=quick-checkout`;
     router.push(url);
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} is now in your shopping cart.`,
    });
    onClose();
  };
  
  const handleBuyNow = () => {
    setView('checkout');
  };

  if (view === 'checkout') {
      return (
        <>
            <ProcessingOverlay show={isProcessing} status={processingStatus} />
            <div className="flex flex-col max-h-[90vh]">
                <DialogHeader className="p-6 text-left border-b">
                    <DialogTitle className="font-headline text-2xl">Instant Checkout</DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
                        <Image src={product.imageUrl} alt={product.name} width={64} height={48} className="rounded-md aspect-video object-cover" />
                        <div className="flex-grow">
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatCurrency(product.price)}</span>
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
                            <Link href="/account/addresses" className="underline font-semibold" onClick={onClose}>Add an address</Link> to continue.
                            </AlertDescription>
                        </Alert>
                    )}
                    </div>
                </div>
                
                <div className="p-6 border-t bg-secondary/30 mt-auto">
                    <Button className="w-full" size="lg" onClick={handleProceedToPayment} disabled={!selectedAddressId || isProcessing}>
                    <CreditCard className="mr-2" />
                    Proceed to Payment
                    </Button>
                </div>
            </div>
            <PaymentDialog
                isOpen={isPaymentDialogOpen}
                onOpenChange={setIsPaymentDialogOpen}
                onPaymentSuccess={handleCardPayment}
                total={orderTotal}
                onPayPalClick={() => handleExternalPaymentRedirect('paypal')}
                onFinanceClick={() => handleExternalPaymentRedirect('finance')}
            />
        </>
      )
  }

  return (
    <div className="flex flex-col max-h-[90vh]">
      <div className="relative aspect-video w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.imageHint}
          />
      </div>
      <div className="flex-1 overflow-y-auto">
        <DialogHeader className="p-6 text-left">
          <DialogTitle className="font-headline text-2xl">{product.name}</DialogTitle>
          <DialogDescription className="pt-2">{product.description}</DialogDescription>
        </DialogHeader>
      </div>
      
      <div className="p-6 border-t bg-secondary/30 mt-auto">
        <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col items-start">
                {originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                        {formatCurrency(originalPrice)}
                    </span>
                )}
                <div className="font-headline text-2xl font-bold text-primary">
                {formatCurrency(product.price)}
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <Button onClick={handleBuyNow} size="lg">
              <Zap className="mr-2" />
              Buy Now
            </Button>
            <Button onClick={handleAddToCart} size="lg" variant="outline">
              <ShoppingCart className="mr-2" />
              Add to Cart
            </Button>
        </div>
      </div>
    </div>
  );
}

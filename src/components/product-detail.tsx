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
import { ShoppingCart, Zap } from "lucide-react";

interface ProductDetailProps {
  product: Product;
  originalPrice?: number;
  onClose: () => void;
}

export function ProductDetail({ product, originalPrice, onClose }: ProductDetailProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} is now in your shopping cart.`,
    });
    onClose();
  };
  
  const handleBuyNow = () => {
    addToCart(product);
    router.push('/cart');
    onClose();
  };

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

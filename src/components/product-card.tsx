"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, BadgePercent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProductDetail } from "./product-detail";

interface ProductCardProps {
  product: Product;
  originalPrice?: number;
}

export function ProductCard({ product, originalPrice }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} is now in your shopping cart.`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card className="flex flex-col overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
        <DialogTrigger asChild>
          <div className="cursor-pointer">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  data-ai-hint={product.imageHint}
                />
                {originalPrice && (
                  <Badge variant="destructive" className="absolute right-2 top-2 flex items-center gap-1">
                      <BadgePercent className="h-4 w-4" /> 50% OFF
                  </Badge>
                )}
              </div>
              <div className="p-4 pb-2">
                <CardTitle className="font-headline text-base h-12">{product.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-4 pt-0">
              <CardDescription className="line-clamp-2 text-xs">{product.description}</CardDescription>
            </CardContent>
          </div>
        </DialogTrigger>
        <CardFooter className="flex items-center justify-between p-4 mt-auto">
          <div className="flex flex-col items-start">
              {originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(originalPrice)}
                  </span>
              )}
              <div className="text-lg font-bold">
              {formatCurrency(product.price)}
              </div>
          </div>
          <Button onClick={handleAddToCart} size="sm">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
      <DialogContent className="p-0 max-w-md gap-0 overflow-hidden rounded-lg">
        <ProductDetail product={product} originalPrice={originalPrice} onClose={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

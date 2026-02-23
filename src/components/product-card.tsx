"use client";

import Image from "next/image";
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

interface ProductCardProps {
  product: Product;
  originalPrice?: number;
}

export function ProductCard({ product, originalPrice }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

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
    <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
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
        <div className="p-6 pb-2">
          <CardTitle className="font-headline text-xl">{product.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between bg-secondary/30 p-4">
        <div className="flex flex-col items-start">
            {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(originalPrice)}
                </span>
            )}
            <div className="font-headline text-xl font-bold text-primary">
            {formatCurrency(product.price)}
            </div>
        </div>
        <Button onClick={handleAddToCart} size="sm">
          <ShoppingCart className="mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

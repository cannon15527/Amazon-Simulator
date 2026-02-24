"use client";

import { usePrime } from "@/hooks/use-prime";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Star, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// A selection of products to feature in the Prime Deals section
const dealProductIds = ["1", "5", "7", "12", "15", "25", "28", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95", "100", "105", "110", "115", "120", "125", "130", "135", "140", "145", "150", "155", "160", "165", "170", "175", "180", "185", "190", "195", "200", "205", "210", "215", "220", "225"];

export default function PrimeDealsPage() {
  const { isPrime } = usePrime();
  const router = useRouter();

  const dealProducts: { product: Product; originalPrice: number }[] = products
    .filter(p => dealProductIds.includes(p.id))
    .map(p => ({
      product: {
        ...p,
        price: p.price * 0.5, // 50% discount
      },
      originalPrice: p.price,
    }));

  if (!isPrime) {
    return (
        <div className="flex flex-col gap-8 py-8 md:py-12">
            <div className="text-center">
                <h1 className="font-bold tracking-tight text-4xl md:text-5xl flex items-center justify-center gap-2">
                    <Star className="text-primary fill-primary"/> Prime Deals
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">Exclusive discounts for our Prime members.</p>
            </div>
             <Card className="text-center py-16 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-950/50">
                <CardHeader>
                    <AlertTriangle className="mx-auto h-12 w-12 text-primary" />
                    <CardTitle className="mt-4 font-headline">Members Only Access</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This is an exclusive area for Amazon Prime members.</p>
                    <p className="text-muted-foreground">Subscribe to Prime to unlock these amazing deals!</p>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button asChild size="lg">
                        <Link href="/account/prime">Upgrade to Prime</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-8 md:py-12">
       <div className="text-center">
            <h1 className="font-bold tracking-tight text-4xl md:text-5xl flex items-center justify-center gap-2">
                <Star className="text-primary fill-primary"/> Prime Deals
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Your exclusive 50% off discounts. Happy shopping!</p>
        </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dealProducts.map(({ product, originalPrice }) => (
          <ProductCard key={product.id} product={product} originalPrice={originalPrice} />
        ))}
      </div>
    </div>
  );
}

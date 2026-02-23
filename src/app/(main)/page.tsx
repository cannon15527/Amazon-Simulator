import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Welcome to SimuShop
        </h1>
        <p className="text-muted-foreground">
          Your one-stop shop for things that don't exist.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

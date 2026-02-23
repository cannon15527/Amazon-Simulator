"use client";

import { useState, useMemo } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchProducts } from "@/ai/flows/product-search-flow";
import { Loader2, Search, Wand2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchedProductIds, setSearchedProductIds] = useState<string[] | null>(
    null
  );
  const { toast } = useToast();

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchedProductIds(null);
    setSelectedCategory("All"); // Reset category filter on new search

    try {
      const result = await searchProducts({ query: searchQuery });
      setSearchedProductIds(result.productIds);
    } catch (error) {
      console.error("AI Search failed:", error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "Could not perform AI search. Please try again.",
      });
      setSearchedProductIds([]); // Set to empty array on error
    } finally {
      setIsSearching(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (searchedProductIds) {
      const idSet = new Set(searchedProductIds);
      // Preserve order from the AI result
      return searchedProductIds.map(id => products.find(p => p.id === id)).filter(Boolean) as typeof products;
    }
    if (selectedCategory !== "All") {
      return products.filter((p) => p.category === selectedCategory);
    }
    return products;
  }, [selectedCategory, searchedProductIds]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchedProductIds(null); // Reset search when a category is clicked
    setSearchQuery("");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchedProductIds(null);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Welcome to Amazon
        </h1>
        <p className="text-muted-foreground">
          Your one-stop shop for things that don't exist.
        </p>
      </div>

      <div className="space-y-4">
        <form onSubmit={handleSearch} className="flex w-full gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search with AI (e.g., 'a toy that defies gravity')"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSearching}>
            {isSearching ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Wand2 />
            )}
            <span className="hidden md:inline ml-2">AI Search</span>
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Or filter by category:
          </p>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category && !searchedProductIds ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {searchedProductIds && (
        <div className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} AI results for <span className="font-bold text-foreground">"{searchQuery}"</span>
            </p>
            <Button variant="ghost" size="sm" onClick={clearSearch}>
                <XCircle className="mr-2"/>
                Clear Search
            </Button>
        </div>
      )}


      {isSearching ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <div className="animate-pulse">
                        <div className="aspect-video w-full bg-muted"></div>
                        <CardHeader><div className="h-6 w-3/4 bg-muted rounded-md"></div></CardHeader>
                        <CardContent className="space-y-2">
                             <div className="h-4 w-full bg-muted rounded-md"></div>
                             <div className="h-4 w-5/6 bg-muted rounded-md"></div>
                        </CardContent>
                        <CardFooter><div className="h-10 w-28 bg-muted rounded-full"></div></CardFooter>
                    </div>
                </Card>
            ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 col-span-full">
            <CardHeader>
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <CardTitle className="mt-4">No Products Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    {searchedProductIds ? "The AI couldn't find any products matching your query." : "There are no products in this category."}
                </p>
            </CardContent>
             <CardFooter className="justify-center">
                 <Button onClick={clearSearch}>
                    Clear Search & Filters
                 </Button>
             </CardFooter>
        </Card>
      )}
    </div>
  );
}

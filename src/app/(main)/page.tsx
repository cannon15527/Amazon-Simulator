"use client";

import { useState, useMemo } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
    setSelectedCategory("All"); // Reset category filter on new search
  };

  const filteredProducts = useMemo(() => {
    let results = products;

    // Filter by search query if a search is active
    if (activeSearch.trim() !== "") {
      const lowercasedQuery = activeSearch.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(lowercasedQuery) ||
          p.description.toLowerCase().includes(lowercasedQuery)
      );
      return results;
    }
    
    // Otherwise, filter by category
    if (selectedCategory !== "All") {
      return products.filter((p) => p.category === selectedCategory);
    }

    return products;
  }, [selectedCategory, activeSearch]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setActiveSearch("");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
  }
  
  const clearAll = () => {
    clearSearch();
    setSelectedCategory("All");
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
              placeholder="Search for products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">
            <Search />
            <span className="hidden md:inline ml-2">Search</span>
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Or filter by category:
          </p>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category && !activeSearch ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {activeSearch && (
        <div className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} results for <span className="font-bold text-foreground">"{activeSearch}"</span>
            </p>
            <Button variant="ghost" size="sm" onClick={clearSearch}>
                <XCircle className="mr-2"/>
                Clear Search
            </Button>
        </div>
      )}


      {filteredProducts.length > 0 ? (
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
                    {activeSearch ? `Your search didn't match any products.` : "There are no products in this category."}
                </p>
            </CardContent>
             <CardFooter className="justify-center">
                 <Button onClick={clearAll}>
                    Clear Search & Filters
                 </Button>
             </CardFooter>
        </Card>
      )}
    </div>
  );
}

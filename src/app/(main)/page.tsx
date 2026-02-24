"use client";

import { useState, useMemo, useEffect } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, XCircle, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("simushop_user_name");
    if (name) {
      setUserName(name);
    }
  }, []);

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

    return results;
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
    <div className="flex flex-col gap-12 py-8 md:py-12">
        <section className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
               {userName ? `Welcome, ${userName}` : 'Imagination, Delivered.'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Your one-stop shop for things that don't exist. Explore our infinite catalog of virtual wonders.
            </p>
            <form onSubmit={handleSearch} className="flex max-w-lg mx-auto gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for anti-gravity boots..."
                  className="pl-10 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg">
                Search
              </Button>
            </form>
        </section>

      <section>
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category && !activeSearch ? "default" : "secondary"}
                size="sm"
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {activeSearch && (
            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg mb-8">
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
            <Card className="text-center py-16 col-span-full border-dashed">
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
      </section>
    </div>
  );
}

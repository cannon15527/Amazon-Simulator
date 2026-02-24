
"use client";

import { useState, useMemo, useEffect } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, XCircle, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";


const PRODUCTS_PER_PAGE = 12;
const FEATURED_PRODUCT_IDS = ["229", "26", "27", "23", "17", "21"];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("alpha-asc");

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
  
  const featuredProducts = useMemo(() => {
    return products.filter(p => FEATURED_PRODUCT_IDS.includes(p.id));
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
    setSelectedCategory("All"); // Reset category filter on new search
    setCurrentPage(1); // Reset to first page on new search
  };

  const filteredProducts = useMemo(() => {
    let results = [...products];

    if (activeSearch.trim() !== "") {
      const lowercasedQuery = activeSearch.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(lowercasedQuery) ||
          p.description.toLowerCase().includes(lowercasedQuery)
      );
    } else if (selectedCategory !== "All") {
      results = results.filter((p) => p.category === selectedCategory);
    }

    switch (sortOption) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "alpha-asc":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "alpha-desc":
        results.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return results;
  }, [selectedCategory, activeSearch, sortOption]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setActiveSearch("");
    setCurrentPage(1);
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
    setCurrentPage(1);
  }
  
  const clearAll = () => {
    clearSearch();
    setSelectedCategory("All");
  }

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className="flex flex-col gap-12 py-8 md:py-12">
        <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-background rounded-xl border">
          <div className="container px-4 md:px-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="inline-block rounded-lg bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground shadow-sm border">
                Prime Day Every Day (In 2029)
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                {userName ? `Welcome back, ${userName}` : 'Imagination, Delivered.'}
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Your one-stop shop for things that don't exist. Explore our infinite catalog of virtual wonders.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center">
                <Button asChild size="lg">
                  <Link href="/prime-deals">
                    <Star className="mr-2" /> Browse Prime Deals
                  </Link>
                </Button>
                 <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
                    <Input 
                      type="text" 
                      placeholder="Search for anti-gravity boots..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit">Search</Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">Featured Items</h2>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {featuredProducts.map((product) => (
                        <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                               <ProductCard product={product} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>

        <section id="browse-all">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Browse All Products</h2>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger className="w-full md:w-[220px]">
                            <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="alpha-asc">Alphabetical: A-Z</SelectItem>
                            <SelectItem value="alpha-desc">Alphabetical: Z-A</SelectItem>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

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

            {paginatedProducts.length > 0 ? (
                <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="flex items-center justify-center pt-12 gap-4">
                    <Button 
                        variant="outline" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="mr-2"/>
                        Previous
                    </Button>
                    <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button 
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight className="ml-2"/>
                    </Button>
                </div>
                </>
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

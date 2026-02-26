
"use client";

import { useState, useMemo, useEffect } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, XCircle, ChevronLeft, ChevronRight, Star, Code, Settings, DollarSign, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useWallet } from "@/hooks/use-wallet";
import { usePrime } from "@/hooks/use-prime";
import { useToast } from "@/hooks/use-toast";
import { INITIAL_WALLET_BALANCE } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";


const PRODUCTS_PER_PAGE = 12;
const FEATURED_PRODUCT_IDS = ["229", "26", "27", "23", "17", "21"];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("alpha-asc");
  const [pageInput, setPageInput] = useState(String(currentPage));
  const [isDevMenuOpen, setIsDevMenuOpen] = useState(false);
  const [customBalance, setCustomBalance] = useState("");


  const { addFunds, setBalance } = useWallet();
  const { isPrime, grantDevPrime, cancelSubscriptionNow } = usePrime();
  const { toast } = useToast();
  const router = useRouter();


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

    if (searchQuery.toLowerCase() === "dev") {
      setIsDevMenuOpen(true);
      setSearchQuery("");
      return;
    }

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
  };

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handlePageInputSubmit = () => {
    let page = parseInt(pageInput, 10);
    if (isNaN(page) || page < 1) {
        page = 1;
    } else if (page > totalPages) {
        page = totalPages;
    }
    handlePageChange(page);
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          handlePageInputSubmit();
          e.currentTarget.blur();
      }
  };

  // --- Dev Menu Functions ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
  };

  const handleDevAddFunds = (amount: number) => {
    addFunds(amount);
    toast({ title: "Dev Action", description: `${formatCurrency(amount)} added to wallet.` });
  };
  
  const handleDevSetBalance = () => {
    const amount = parseFloat(customBalance);
    if (!isNaN(amount) && amount >= 0) {
      const amountInCents = Math.round(amount * 100);
      setBalance(amountInCents);
      toast({ title: "Dev Action", description: `Wallet balance set to ${formatCurrency(amountInCents)}.` });
      setCustomBalance("");
    } else {
      toast({ variant: "destructive", title: "Dev Action Failed", description: "Please enter a valid, non-negative amount." });
    }
  };


  const handleDevTogglePrime = () => {
    if (isPrime) {
      cancelSubscriptionNow();
      toast({ title: "Dev Action", description: "Prime membership cancelled." });
    } else {
      const devRenewalDate = new Date('2099-12-31T23:59:59Z');
      grantDevPrime(devRenewalDate);
      toast({ title: "Dev Action", description: "Prime membership granted until 12/31/2099." });
    }
  };

  const handleDevReset = () => {
    localStorage.clear();
    setBalance(INITIAL_WALLET_BALANCE);
    setIsDevMenuOpen(false);
    toast({ title: "Dev Action", description: "Full application reset successful." });
    setTimeout(() => router.push('/signup'), 500);
  };
  // --------------------------

  return (
    <div className="flex flex-col gap-12 py-8 md:py-12">
        <section className="w-full py-4 md:py-6 bg-gradient-to-br from-primary/5 via-background to-background rounded-xl border">
          <div className="container px-4 md:px-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
                {userName ? `Welcome back, ${userName}` : 'Imagination, Delivered.'}
              </h1>
              <p className="max-w-[700px] text-muted-foreground text-lg">
                Your one-stop shop for things that don't exist. Explore our infinite catalog of virtual wonders.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center">
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
            <h2 className="text-base font-semibold tracking-tight mb-2">Sponsored Recommendations</h2>
             <Card>
                <CardContent className="p-3">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        {featuredProducts.map((product) => (
                           <ProductCard key={product.id} product={product} isSponsored={true} variant="compact" />
                        ))}
                    </div>
                </CardContent>
            </Card>
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

            <div className="flex flex-wrap items-center gap-2 mb-4">
                {categories.map((category) => (
                <Button
                    key={category}
                    variant={selectedCategory === category && !activeSearch ? "default" : "secondary"}
                    size="sm"
                    onClick={() => handleCategoryClick(category)}
                    className="rounded-full px-4"
                >
                    {category}
                </Button>
                ))}
            </div>

            <div className="mb-8">
              {activeSearch ? (
                  <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                          Showing {filteredProducts.length} results for <span className="font-bold text-foreground">"{activeSearch}"</span>
                      </p>
                      <Button variant="ghost" size="sm" onClick={clearSearch}>
                          <XCircle className="mr-2"/>
                          Clear Search
                      </Button>
                  </div>
              ) : (
                  <p className="text-sm text-muted-foreground py-3">
                    Showing {paginatedProducts.length} of {filteredProducts.length} products
                  </p>
              )}
            </div>

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
                    
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <span>Page</span>
                        <Input
                            type="number"
                            value={pageInput}
                            onChange={(e) => setPageInput(e.target.value)}
                            onBlur={handlePageInputSubmit}
                            onKeyDown={handlePageInputKeyDown}
                            className="h-8 w-16 text-center"
                            min="1"
                            max={totalPages}
                        />
                        <span>of {totalPages}</span>
                    </div>

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

        <Dialog open={isDevMenuOpen} onOpenChange={setIsDevMenuOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Code /> Developer Menu</DialogTitle>
                    <DialogDescription>Use these controls to manipulate the application state for testing purposes.</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2"><DollarSign /> Wallet Controls</h4>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleDevAddFunds(100000)}>$1,000</Button>
                            <Button variant="outline" onClick={() => handleDevAddFunds(1000000)}>$10,000</Button>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <Input
                                type="number"
                                placeholder="Set exact balance ($)"
                                value={customBalance}
                                onChange={(e) => setCustomBalance(e.target.value)}
                                className="h-9"
                            />
                            <Button onClick={handleDevSetBalance} className="h-9">Set Balance</Button>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2"><Star /> Prime Controls</h4>
                        <Button variant="outline" onClick={handleDevTogglePrime}>{isPrime ? "Cancel Prime Membership" : "Grant Prime Membership"}</Button>
                    </div>
                    <Separator />
                    <div className="space-y-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                        <h4 className="font-medium flex items-center gap-2 text-destructive"><Trash2 /> Danger Zone</h4>
                        <p className="text-sm text-destructive/80">This will clear all localStorage data (wallet, cart, orders, etc.) and reset the simulation.</p>
                        <Button variant="destructive" onClick={handleDevReset}>Reset Application State</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}

    

    
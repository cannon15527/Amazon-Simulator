"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateProductDescription } from "@/ai/flows/generate-product-description";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters."),
  productCategory: z.string().min(3, "Product category must be at least 3 characters."),
});

export default function AiDescriptionGeneratorPage() {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productCategory: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setDescription("");
    try {
      const result = await generateProductDescription(values);
      setDescription(result.description);
    } catch (error) {
      console.error("AI Generation failed:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate a description. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/40">
        <header className="flex items-center justify-between p-4 border-b bg-background">
            <div className="flex items-center gap-2">
                <Wand2 className="h-6 w-6 text-primary"/>
                <h1 className="text-xl font-bold font-headline">AI Product Description Generator</h1>
            </div>
            <Button asChild variant="outline">
                <Link href="/">Back to Shop</Link>
            </Button>
        </header>

        <main className="p-4 md:p-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Generate a Whimsical Description</CardTitle>
                    <CardDescription>Enter a product name and category, and our AI will write a fun and engaging description for it.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="productName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Anti-Gravity Boots" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="productCategory"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Product Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Footwear" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Generate Description
                        </Button>
                    </form>
                    </Form>
                </CardContent>
                {(isLoading || description) && (
                    <CardFooter className="flex-col items-start gap-2 border-t pt-6">
                        <h3 className="font-semibold text-lg">Generated Description:</h3>
                        {isLoading ? (
                             <div className="space-y-2 w-full">
                                <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                                <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                                <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                            </div>
                        ) : (
                             <Textarea readOnly value={description} className="h-32 bg-background" />
                        )}
                       
                    </CardFooter>
                )}
            </Card>
        </main>
    </div>
  );
}

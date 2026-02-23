'use server';
/**
 * @fileOverview An AI agent that searches for products based on a natural language query.
 *
 * - searchProducts - A function that handles the product search process.
 * - SearchProductsInput - The input type for the searchProducts function.
 * - SearchProductsOutput - The return type for the searchProducts function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {getProductCatalog} from '@/ai/tools/product-catalog';

const SearchProductsInputSchema = z.object({
  query: z.string().describe("The user's search query for a product."),
});
export type SearchProductsInput = z.infer<typeof SearchProductsInputSchema>;

const SearchProductsOutputSchema = z.object({
  productIds: z
    .array(z.string())
    .describe('A list of product IDs that best match the user\'s query.'),
});
export type SearchProductsOutput = z.infer<typeof SearchProductsOutputSchema>;

export async function searchProducts(
  input: SearchProductsInput
): Promise<SearchProductsOutput> {
  return searchProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productSearchPrompt',
  input: {schema: SearchProductsInputSchema},
  output: {schema: SearchProductsOutputSchema},
  tools: [getProductCatalog],
  prompt: `You are a helpful product search engine for an imaginary online shop called Amazon.
Your goal is to find products in the catalog that match the user's search query.
The query might be a direct product name, a description of what the user wants, or just a general idea.
Use the product catalog tool to get the list of available products.
Return a list of product IDs that are the best matches. If there are no good matches, return an empty list.

User query: {{{query}}}`,
});

const searchProductsFlow = ai.defineFlow(
  {
    name: 'searchProductsFlow',
    inputSchema: SearchProductsInputSchema,
    outputSchema: SearchProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

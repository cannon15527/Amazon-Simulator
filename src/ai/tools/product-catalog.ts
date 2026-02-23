'use server';
import {products} from '@/lib/products';
import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Tool to get product data
export const getProductCatalog = ai.defineTool(
  {
    name: 'getProductCatalog',
    description: 'Returns the full catalog of available products in the store.',
    inputSchema: z.void(),
    outputSchema: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        category: z.string(),
      })
    ),
  },
  async () => {
    // Return a simplified version of the product data for the AI
    return products.map(({id, name, description, category}) => ({
      id,
      name,
      description,
      category,
    }));
  }
);

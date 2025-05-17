'use server';
/**
 * @fileOverview Recommends vendors based on the user's search query.
 *
 * - recommendVendors - A function that recommends vendors based on the user's search query.
 * - RecommendVendorsInput - The input type for the recommendVendors function.
 * - RecommendVendorsOutput - The return type for the recommendVendors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendVendorsInputSchema = z.object({
  searchQuery: z.string().describe('The user\u2019s search query.'),
});
export type RecommendVendorsInput = z.infer<typeof RecommendVendorsInputSchema>;

const RecommendVendorsOutputSchema = z.object({
  vendorRecommendations: z
    .array(z.string())
    .describe('A list of recommended vendor names, ordered by relevance.'),
});
export type RecommendVendorsOutput = z.infer<typeof RecommendVendorsOutputSchema>;

export async function recommendVendors(input: RecommendVendorsInput): Promise<RecommendVendorsOutput> {
  return recommendVendorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendVendorsPrompt',
  input: {schema: RecommendVendorsInputSchema},
  output: {schema: RecommendVendorsOutputSchema},
  prompt: `You are an expert in matching user search queries to relevant vendors in the pet supplies market.

  Given the following user search query, identify the top vendors to feature to maximize relevance and sales potential.

  User Search Query: {{{searchQuery}}}

  Consider a variety of vendors, and only recommend vendors that are highly relevant to the search query. Return a list of vendors ordered by relevance. Vendors at the beginning of the list are more relevant than vendors at the end of the list.
  `,
});

const recommendVendorsFlow = ai.defineFlow(
  {
    name: 'recommendVendorsFlow',
    inputSchema: RecommendVendorsInputSchema,
    outputSchema: RecommendVendorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

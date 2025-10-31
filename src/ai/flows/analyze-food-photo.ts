'use server';

/**
 * @fileOverview Analyzes a photo of a meal to identify food items, and estimate nutritional information.
 *
 * - analyzeFoodPhoto - A function that handles the food photo analysis process.
 * - AnalyzeFoodPhotoInput - The input type for the analyzeFoodPhoto function.
 * - AnalyzeFoodPhotoOutput - The return type for the analyzeFoodPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFoodPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeFoodPhotoInput = z.infer<typeof AnalyzeFoodPhotoInputSchema>;

const AnalyzeFoodPhotoOutputSchema = z.object({
  foodItems: z.array(z.object({
    name: z.string().describe('The identified name of the food item.'),
    calories: z.number().describe('Estimated calories for the food item.'),
    protein: z.number().describe('Estimated protein in grams.'),
    carbohydrates: z.number().describe('Estimated carbohydrates in grams.'),
    fat: z.number().describe('Estimated fat in grams.'),
    sugar: z.number().describe('Estimated sugar in grams.'),
    sodium: z.number().describe('Estimated sodium in milligrams.'),
    fiber: z.number().describe('Estimated fiber in grams.'),
  })).describe('An array of food items identified in the photo with their nutritional information.'),
});
export type AnalyzeFoodPhotoOutput = z.infer<typeof AnalyzeFoodPhotoOutputSchema>;


export async function analyzeFoodPhoto(input: AnalyzeFoodPhotoInput): Promise<AnalyzeFoodPhotoOutput> {
  return analyzeFoodPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFoodPhotoPrompt',
  input: {schema: AnalyzeFoodPhotoInputSchema},
  output: {schema: AnalyzeFoodPhotoOutputSchema},
  prompt: `You are a nutrition expert. Analyze the provided photo of a meal. Identify each food item in the image and estimate its nutritional information, including calories, protein, carbohydrates, fat, sugar, sodium, and fiber.

  Return the data as a structured list of identified food items and their nutritional breakdown.

  Photo: {{media url=photoDataUri}}`,
});

const analyzeFoodPhotoFlow = ai.defineFlow(
  {
    name: 'analyzeFoodPhotoFlow',
    inputSchema: AnalyzeFoodPhotoInputSchema,
    outputSchema: AnalyzeFoodPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

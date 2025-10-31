'use server';

/**
 * @fileOverview Provides food recommendations based on user mood.
 *
 * - getFoodRecommendationsByMood - A function that generates food recommendations based on user mood.
 * - FoodRecommendationsByMoodInput - The input type for the getFoodRecommendationsByMood function.
 * - FoodRecommendationsByMoodOutput - The return type for the getFoodRecommendationsByMood function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FoodRecommendationsByMoodInputSchema = z.object({
  mood: z.string().describe('The user\'s current mood (e.g., Happy, Sad, Anxious, Stressed, Calm).'),
  energy: z.string().optional().describe('The user\'s energy level (e.g., High, Moderate, Low).'),
  notes: z.string().optional().describe('Additional notes about the user\'s mood or state.'),
});
export type FoodRecommendationsByMoodInput = z.infer<
  typeof FoodRecommendationsByMoodInputSchema
>;

const FoodRecommendationSchema = z.object({
  name: z.string().describe('The name of the recommended food or meal.'),
  description: z.string().describe('A brief description of why this food is recommended for the mood.'),
  nutrients: z.array(z.string()).describe('Key nutrients or benefits this food provides.'),
  serving: z.string().describe('Recommended serving size or portion.'),
  timing: z.string().optional().describe('Best time to consume (e.g., morning, afternoon, evening).'),
});

const FoodRecommendationsByMoodOutputSchema = z.object({
  recommendations: z.array(FoodRecommendationSchema).describe('A list of 4-6 food recommendations tailored to the user\'s mood.'),
  explanation: z.string().describe('A brief explanation of how food can help with the current mood.'),
});
export type FoodRecommendationsByMoodOutput = z.infer<
  typeof FoodRecommendationsByMoodOutputSchema
>;

export async function getFoodRecommendationsByMood(
  input: FoodRecommendationsByMoodInput
): Promise<FoodRecommendationsByMoodOutput> {
  return foodRecommendationsByMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'foodRecommendationsByMoodPrompt',
  input: { schema: FoodRecommendationsByMoodInputSchema },
  output: { schema: FoodRecommendationsByMoodOutputSchema },
  prompt: `You are a nutritionist and wellness expert. Provide personalized food recommendations based on the user's current mood and energy level.

User's Current State:
- Mood: {{{mood}}}
{{#if energy}}- Energy Level: {{{energy}}}{{/if}}
{{#if notes}}- Notes: {{{notes}}}{{/if}}

Based on the user's mood, recommend 4-6 specific foods or meals that can help:
1. Support emotional wellbeing
2. Provide energy if low, or promote calm if anxious/stressed
3. Boost mood naturally
4. Provide essential nutrients for mental health

For each recommendation, provide:
- A specific food or meal name
- Why this food helps with their current mood
- Key nutrients or benefits
- Recommended serving size
- Best time to consume (if relevant)

Also provide a brief explanation of how food and nutrition can impact mood and emotional wellbeing.

Focus on real, accessible foods that can positively influence their mood state.`,
});

const foodRecommendationsByMoodFlow = ai.defineFlow(
  {
    name: 'foodRecommendationsByMoodFlow',
    inputSchema: FoodRecommendationsByMoodInputSchema,
    outputSchema: FoodRecommendationsByMoodOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);


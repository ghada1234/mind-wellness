'use server';

/**
 * @fileOverview Generates a personalized meal plan based on user profile and goals.
 *
 * - generateMealPlan - A function that handles the meal plan generation process.
 * - GenerateMealPlanInput - The input type for the generateMealPlan function.
 * - GenerateMealPlanOutput - The return type for the generateMealPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMealPlanInputSchema = z.object({
  age: z.number().describe('The age of the user.'),
  gender: z.string().describe('The gender of the user.'),
  height: z.number().describe('The height of the user in centimeters.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  activityLevel: z
    .string()
    .describe('The activity level of the user (e.g., Sedentary, Lightly Active).'),
  goal: z.string().describe('The user\'s primary goal (e.g., Weight Loss, Muscle Gain).'),
  duration: z.coerce.number().describe('The number of days for the meal plan (e.g., 1, 7, 30).'),
  cuisine: z.string().optional().describe('The user\'s preferred cuisine (e.g., Italian, Any).'),
  allergies: z.string().optional().describe('A list of allergies the user has.'),
  dislikes: z.string().optional().describe('A list of foods the user dislikes.'),
  diet: z.string().optional().describe('Any specific dietary preference (e.g., Vegan, Keto).'),
});
export type GenerateMealPlanInput = z.infer<typeof GenerateMealPlanInputSchema>;

const MealSchema = z.object({
    name: z.string().describe("The name of the meal."),
    description: z.string().describe("A brief description of the meal."),
    ingredients: z.array(z.string()).describe("A list of ingredients for the meal."),
    instructions: z.string().describe("Step-by-step cooking instructions."),
    calories: z.number().describe("Estimated calories for the meal."),
    protein: z.number().describe("Estimated protein in grams."),
    carbohydrates: z.number().describe("Estimated carbohydrates in grams."),
    fat: z.number().describe("Estimated fat in grams."),
});

const DailyPlanSchema = z.object({
    day: z.string().describe("The day of the week (e.g., Day 1, Monday)."),
    breakfast: MealSchema,
    lunch: MealSchema,
    dinner: MealSchema,
    dailyTotals: z.object({
        calories: z.number().describe("Total estimated calories for the day."),
        protein: z.number().describe("Total estimated protein for the day."),
        carbohydrates: z.number().describe("Total estimated carbohydrates for the day."),
        fat: z.number().describe("Total estimated fat for the day."),
    }),
});

const GenerateMealPlanOutputSchema = z.object({
  plan: z.array(DailyPlanSchema).describe('A meal plan for the specified duration.'),
});
export type GenerateMealPlanOutput = z.infer<typeof GenerateMealPlanOutputSchema>;

export async function generateMealPlan(input: GenerateMealPlanInput): Promise<GenerateMealPlanOutput> {
  return generateMealPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMealPlanPrompt',
  input: { schema: GenerateMealPlanInputSchema },
  output: { schema: GenerateMealPlanOutputSchema },
  prompt: `You are an expert nutritionist and chef. Create a personalized {{duration}}-day meal plan for the user based on the following details.

User Profile:
- Age: {{age}}
- Gender: {{gender}}
- Height: {{height}} cm
- Weight: {{weight}} kg
- Activity Level: {{activityLevel}}
- Primary Goal: {{goal}}

Dietary Preferences:
- Preferred Cuisine: {{#if cuisine}}{{cuisine}}{{else}}Any{{/if}}
- Allergies: {{#if allergies}}{{allergies}}{{else}}None specified{{/if}}
- Dislikes: {{#if dislikes}}{{dislikes}}{{else}}None specified{{/if}}
- Diet: {{#if diet}}{{diet}}{{else}}None specified{{/if}}

For each day, provide a breakfast, lunch, and dinner. For each meal, include:
1. A creative and appealing name.
2. A brief, enticing description.
3. A list of ingredients.
4. Step-by-step cooking instructions.
5. An estimation of calories, protein, carbohydrates, and fat.

Also, calculate the total estimated macronutrients for each day.

Ensure the plan is balanced, delicious, and aligns with the user's goal. Be creative and provide variety.
`,
});

const generateMealPlanFlow = ai.defineFlow(
  {
    name: 'generateMealPlanFlow',
    inputSchema: GenerateMealPlanInputSchema,
    outputSchema: GenerateMealPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

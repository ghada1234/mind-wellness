'use server';

/**
 * @fileOverview Provides personalized wellness recommendations based on user data, trends, and goals.
 *
 * - getPersonalizedRecommendations - A function that generates personalized wellness recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  mood: z.string().describe('The user logged mood.'),
  sleepDuration: z.number().describe('The user sleep duration in hours.'),
  calorieIntake: z.number().describe('The user daily calorie intake.'),
  workoutTime: z.number().describe('The user workout time in minutes.'),
  dailySteps: z.number().describe('The number of steps the user took today.'),
  meditationMinutes: z.number().describe('The amount of meditation the user has done today in minutes.'),
  journalEntries: z.array(z.string()).describe('The user journal entries.'),
  goals: z.array(z.string()).describe('The user goals.'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const RecommendationSchema = z.object({
  title: z.string().describe('The title of the recommendation.'),
  priority: z.enum(['High', 'Medium', 'Low']).describe('The priority level of the recommendation.'),
  impact: z.enum(['High', 'Medium', 'Low']).describe('The potential impact of implementing the recommendation.'),
  duration: z.string().describe('The estimated time to see results, e.g., "1-2 Weeks".'),
  description: z.string().describe('A detailed description of the recommendation and the reasoning behind it.'),
  recommendedActions: z.array(z.string()).describe('A list of specific, actionable steps for the user to take.'),
});

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).describe('A list of personalized wellness recommendations.'),
});

export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a wellness expert providing personalized recommendations to the user.

  Based on the user's logged data, trends, and goals, provide a list of tailored suggestions for improving their well-being. For each recommendation, provide a title, priority, impact, duration, a clear description of the issue and the benefit of addressing it, and a list of specific, actionable steps.

  Here is the user's data:
  Mood: {{{mood}}}
  Sleep Duration: {{{sleepDuration}}} hours
  Calorie Intake: {{{calorieIntake}}} calories
  Workout Time: {{{workoutTime}}} minutes
  Daily Steps: {{{dailySteps}}} steps
  Meditation: {{{meditationMinutes}}} minutes
  Journal Entries: {{#each journalEntries}} - {{{this}}}{{/each}}
  Goals: {{#each goals}} - {{{this}}}{{/each}}

  Generate 3-4 diverse and actionable recommendations based on the most important areas for improvement derived from the user's data. Ensure the recommendations are achievable and directly related to the user's data and goals.
  `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

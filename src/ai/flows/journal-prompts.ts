'use server';

/**
 * @fileOverview Provides AI-generated journal writing prompts to inspire users.
 *
 * - generateJournalPrompts - A function that returns a list of journal prompts.
 * - GenerateJournalPromptsInput - The input type for the generateJournalPrompts function.
 * - GenerateJournalPromptsOutput - The return type for the generateJournalPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJournalPromptsInputSchema = z.object({
  mood: z.string().optional().describe('The current mood of the user.'),
  recentActivity: z
    .string()
    .optional()
    .describe('A summary of the user\'s recent activities.'),
});
export type GenerateJournalPromptsInput = z.infer<typeof GenerateJournalPromptsInputSchema>;

const GenerateJournalPromptsOutputSchema = z.object({
  prompts: z
    .array(z.string())
    .describe('A list of journal writing prompts to inspire the user.'),
});
export type GenerateJournalPromptsOutput = z.infer<typeof GenerateJournalPromptsOutputSchema>;

export async function generateJournalPrompts(
  input: GenerateJournalPromptsInput
): Promise<GenerateJournalPromptsOutput> {
  return generateJournalPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJournalPromptsPrompt',
  input: {schema: GenerateJournalPromptsInputSchema},
  output: {schema: GenerateJournalPromptsOutputSchema},
  prompt: `You are an AI journaling assistant. Your job is to generate a list of journal prompts to inspire the user to write in their journal.

Consider the user's current mood and recent activities when generating the prompts, if available.  Make the prompts open-ended and reflective.

Mood: {{mood}}
Recent Activities: {{recentActivity}}

Here are some example prompts to follow:

- What are you grateful for today?
- What challenges did you face today, and how did you overcome them?
- What did you learn today?
- What are your goals for tomorrow?
- How are you feeling emotionally and physically today, and why do you think you feel that way?
- What are some things that you are looking forward to?

Generate a list of 5 unique prompts.`,
});

const generateJournalPromptsFlow = ai.defineFlow(
  {
    name: 'generateJournalPromptsFlow',
    inputSchema: GenerateJournalPromptsInputSchema,
    outputSchema: GenerateJournalPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

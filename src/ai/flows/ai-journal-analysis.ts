'use server';

/**
 * @fileOverview Analyzes journal entries to identify recurring themes and provide insights into emotional trends.
 *
 * - analyzeJournalEntries - A function that handles the journal entry analysis process.
 * - AnalyzeJournalEntriesInput - The input type for the analyzeJournalEntries function.
 * - AnalyzeJournalEntriesOutput - The return type for the analyzeJournalEntries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeJournalEntriesInputSchema = z.object({
  journalEntries: z
    .string()
    .describe('The journal entries to analyze, concatenated into a single string.'),
});
export type AnalyzeJournalEntriesInput = z.infer<typeof AnalyzeJournalEntriesInputSchema>;

const AnalyzeJournalEntriesOutputSchema = z.object({
  recurringThemes: z
    .string()
    .describe('The recurring themes identified in the journal entries.'),
  emotionalTrends: z
    .string()
    .describe('The emotional trends observed in the journal entries.'),
  insights: z
    .string()
    .describe('Insights derived from the analysis of the journal entries.'),
});
export type AnalyzeJournalEntriesOutput = z.infer<typeof AnalyzeJournalEntriesOutputSchema>;

export async function analyzeJournalEntries(input: AnalyzeJournalEntriesInput): Promise<AnalyzeJournalEntriesOutput> {
  return analyzeJournalEntriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeJournalEntriesPrompt',
  input: {schema: AnalyzeJournalEntriesInputSchema},
  output: {schema: AnalyzeJournalEntriesOutputSchema},
  prompt: `You are an AI Journal Assistant that analyzes journal entries, identifies recurring themes, and provides insights into emotional trends.

  Analyze the following journal entries:
  {{{journalEntries}}}

  Identify any recurring themes, emotional trends, and provide insights into the user's mental and emotional state.

  Return the recurring themes, emotional trends, and insights in the output schema format.
  `,
});

const analyzeJournalEntriesFlow = ai.defineFlow(
  {
    name: 'analyzeJournalEntriesFlow',
    inputSchema: AnalyzeJournalEntriesInputSchema,
    outputSchema: AnalyzeJournalEntriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

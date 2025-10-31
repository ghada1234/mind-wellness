'use server';

/**
 * @fileOverview A conversational AI wellness assistant.
 *
 * - chatWithAssistant - A function that handles the conversational chat with the AI assistant.
 * - ChatWithAssistantInput - The input type for the chatWithAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Message, Role} from 'genkit/model';

const ChatWithAssistantInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model', 'system', 'tool']),
    content: z.array(z.object({
        text: z.string(),
    })),
  })).describe('The chat history.'),
  message: z.string().describe('The new user message.'),
});
export type ChatWithAssistantInput = z.infer<typeof ChatWithAssistantInputSchema>;

export async function chatWithAssistant(input: ChatWithAssistantInput): Promise<string> {
  return wellnessAssistantFlow(input);
}

const wellnessAssistantFlow = ai.defineFlow(
  {
    name: 'wellnessAssistantFlow',
    inputSchema: ChatWithAssistantInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const history: Message[] = input.history.map(h => ({
        role: h.role as Role,
        content: h.content,
    }));

    const response = await ai.generate({
      prompt: input.message,
      history,
      system: `You are an AI Wellness Assistant. You are friendly, knowledgeable, and encouraging. Your goal is to help users understand their wellness data and achieve their goals. Keep your responses concise and easy to understand.`,
    });

    return response.text;
  }
);

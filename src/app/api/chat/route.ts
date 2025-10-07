import type { CoreMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { createTransaction } from "@/lib/finance";

const openai = createOpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { messages } = (await req.json()) as { messages: CoreMessage[] };
  if (!Array.isArray(messages))
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });

  const result = streamText({
    model: openai(process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile"),
    messages,
    tools: {
      logTransaction: tool({
        description: "Persist a transaction",
        parameters: z.object({
          amount: z.number().positive(),
          type: z.enum(["income", "expense"]),
          category: z.string().optional(),
          description: z.string().optional(),
          transactionDate: z.string().optional(),
        }),
        execute: async ({ amount, type, category, description, transactionDate }) => {
          const tx = await createTransaction({
            userId,
            amount,
            type,
            categoryName: category,
            description,
            transactionDate,
          });
          return { status: "success" as const, transaction: tx };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}

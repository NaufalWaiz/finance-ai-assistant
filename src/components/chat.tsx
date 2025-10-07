"use client";

import { useCallback, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { Bot, Loader2, NotebookPen, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const examplePrompts = [
  "Logged a $15 coffee with friends yesterday",
  "I received my $2,800 paycheck today",
  "Transferred $200 to my savings account",
];

type RoleLabel = {
  role: "user" | "assistant" | "system" | "tool" | "data";
  label: string;
};

const ROLE_LABELS: Record<RoleLabel["role"], RoleLabel["label"]> = {
  user: "You",
  assistant: "LedgerLens",
  system: "System",
  tool: "LedgerLens",
  data: "LedgerLens",
};

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    isLoading: chatLoading,
    append,
    setInput,
  } = useChat({
    onError: (chatError) => {
      console.error("Chat error:", chatError);
    },
  });

  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const handleExample = useCallback(
    async (prompt: string) => {
      setInput("");
      await append({ role: "user", content: prompt });
    },
    [append, setInput],
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <NotebookPen className="h-6 w-6" />
        </div>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
          Log transactions with your finance copilot
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Share income, expenses, and transfers in plain language. LedgerLens will
          save the details to your secure ledger and offer quick guidance.
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50/70 p-4 text-sm text-red-600 dark:border-red-400/40 dark:bg-red-900/20 dark:text-red-200">
          {error.message || "An unexpected error occurred while processing your request."}
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {examplePrompts.map((prompt) => (
          <Button
            key={prompt}
            type="button"
            variant="secondary"
            size="sm"
            className="whitespace-nowrap"
            onClick={() => handleExample(prompt)}
            disabled={chatLoading}
          >
            {prompt}
          </Button>
        ))}
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        {messages.length === 0 && !chatLoading ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center text-sm text-slate-600 dark:text-slate-300">
            <Bot className="h-6 w-6 text-emerald-500" />
            <p>
              Try messages like 
              <span className="font-semibold">Spent $42 on groceries today</span>
              or 
              <span className="font-semibold">Earned $550 from freelance work last Friday.</span>
            </p>
            <p>
              LedgerLens will file the transaction and suggest ways to keep your goals on track.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <Card
                key={message.id}
                className="border-slate-200/60 bg-white/90 p-4 dark:border-slate-800/60 dark:bg-slate-900/70"
              >
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Bot className="h-4 w-4 text-emerald-500" />
                  )}
                  <span>{ROLE_LABELS[(message.role as RoleLabel["role"]) ?? "assistant"]}</span>
                </div>
                <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  {message.content}
                </div>
              </Card>
            ))}

            {chatLoading && (
              <Card className="border-slate-200/60 bg-white/90 p-4 dark:border-slate-800/60 dark:bg-slate-900/70">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Bot className="h-4 w-4 text-emerald-500" />
                  <span>LedgerLens</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Working on your update...
                </div>
              </Card>
            )}
          </div>
        )}
        <div ref={scrollAnchorRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          placeholder="Describe a transaction or ask for advice..."
          onChange={handleInputChange}
          className="flex-1"
          disabled={chatLoading}
        />
        <Button type="submit" disabled={chatLoading || !input.trim()}>
          {chatLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}

"use client";

import Link from "next/link";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { ThemeToggle } from "@/components/theme-toggle";

import Chat from "@/components/chat";

import { Button } from "@/components/ui/button";

import {

  ArrowRight,

  BarChart3,

  Bot,

  PiggyBank,

  Shield,

  Sparkles,

  Wallet,

} from "lucide-react";

export default function Home() {

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">

      <header className="relative px-4 sm:px-6">

        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">

          <div className="flex items-center gap-3">

            <ThemeToggle />

            <SignedOut>

              <SignInButton mode="modal">

                <Button size="sm" className="text-xs sm:text-sm">

                  Sign In

                </Button>

              </SignInButton>

            </SignedOut>

            <SignedIn>

              <UserButton afterSignOutUrl="/" />

            </SignedIn>

          </div>

        </div>

        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 py-16 text-center sm:py-24">

          <span className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-900/40 dark:text-emerald-200">

            LedgerLens Finance AI

          </span>

          <div className="flex flex-col items-center gap-6">

            <h1 className="text-4xl font-bold leading-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">

              Track cash flow, log spending, and unlock advice with a single chat.

            </h1>

            <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">

              LedgerLens turns your natural language into structured transactions, keeps every dollar organised, and surfaces AI-powered insights so you can make confident money moves.

            </p>

          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <SignedOut>

              <SignInButton mode="modal">

                <Button size="lg" className="gap-2">

                  Start chatting about your money

                  <ArrowRight className="h-4 w-4" />

                </Button>

              </SignInButton>

            </SignedOut>

            <SignedIn>

              <Button asChild size="lg" className="gap-2">

                <Link href="/dashboard">

                  Open my dashboard

                  <ArrowRight className="h-4 w-4" />

                </Link>

              </Button>

            </SignedIn>

            <Button variant="outline" size="lg" className="gap-2">

              <Link href="#how-it-works" className="flex items-center gap-2">

                Learn how it works

                <Sparkles className="h-4 w-4" />

              </Link>

            </Button>

          </div>

          <dl className="grid w-full gap-4 text-left sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">

              <dt className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">

                <Wallet className="h-4 w-4 text-emerald-500" />

                Conversational logging

              </dt>

              <dd className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">

                Spent $24 on groceries becomes a structured transaction instantly.

              </dd>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">

              <dt className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">

                <BarChart3 className="h-4 w-4 text-emerald-500" />

                Insightful dashboards

              </dt>

              <dd className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">

                Visualise income, expenses, categories, and asset growth at a glance.

              </dd>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">

              <dt className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">

                <Shield className="h-4 w-4 text-emerald-500" />

                Secure by design

              </dt>

              <dd className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">

                Clerk authentication and Supabase RLS keep every record private to you.

              </dd>

            </div>

          </dl>

        </div>

      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-20 sm:px-6">

        <section id="how-it-works" className="grid gap-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 lg:grid-cols-[1.1fr,0.9fr]">

          <div className="space-y-6">

            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">

              How LedgerLens keeps your finances organised

            </h2>

            <ol className="space-y-4 text-slate-600 dark:text-slate-300">

              <li className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">

                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-emerald-500/10 text-sm font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">

                  1

                </span>

                <div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Chat in plain language</h3>

                  <p>Tell the assistant about income, expenses, or asset updates. The AI extracts amounts, categories, and dates automatically.</p>

                </div>

              </li>

              <li className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">

                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-emerald-500/10 text-sm font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">

                  2

                </span>

                <div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Store securely in Supabase</h3>

                  <p>Transactions, categories, and assets are saved to your private tables using Clerk-authenticated policies.</p>

                </div>

              </li>

              <li className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">

                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-emerald-500/10 text-sm font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">

                  3

                </span>

                <div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Review insights instantly</h3>

                  <p>Jump into the dashboard to analyse cash flow trends, spending by category, and the health of your assets.</p>

                </div>

              </li>

            </ol>

          </div>

          <div className="flex flex-col justify-between gap-8 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent p-6 dark:border-emerald-900/60 dark:from-emerald-500/20 dark:via-slate-950 dark:to-transparent">

            <div className="space-y-3">

              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm dark:bg-slate-950/70 dark:text-emerald-200">

                <Bot className="h-4 w-4" />

                AI insights

              </div>

              <p className="text-lg text-slate-700 dark:text-slate-200">

                You have spent 32% of your dining budget this month. Rebalancing $150 from discretionary funds will keep you on track.

              </p>

            </div>

            <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/60">

              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">

                <PiggyBank className="h-4 w-4 text-emerald-500" />

                Snapshot metrics

              </h3>

              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">

                <li>- Income vs. expense burn-down</li>

                <li>- Category drill-downs and trending months</li>

                <li>- Net worth and asset allocation guidance</li>

              </ul>

            </div>

          </div>

        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">

          <SignedIn>

            <div className="mb-6 flex flex-col gap-2 text-center">

              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-300">

                Try it now

              </span>

              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">

                Log your next transaction with the chat assistant

              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300">

                Ask things like Paid $1,250 rent yesterday or Transferred $200 to my savings account.

              </p>

            </div>

            <Chat />

          </SignedIn>

          <SignedOut>

            <div className="flex flex-col items-center gap-4 py-12 text-center">

              <Bot className="h-12 w-12 text-emerald-500" />

              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">

                Sign in to start chatting with your finance copilot

              </h2>

              <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">

                Create an account with Clerk and LedgerLens will remember every income and expense you share.

              </p>

              <SignInButton mode="modal">

                <Button size="lg" className="gap-2">

                  Sign in to continue

                  <ArrowRight className="h-4 w-4" />

                </Button>

              </SignInButton>

            </div>

          </SignedOut>

        </section>

      </main>

    </div>

  );

}


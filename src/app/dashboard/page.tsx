import { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CashFlowChart, SpendingByCategoryChart } from "@/components/dashboard/charts";
import { fetchDashboardSnapshot } from "@/lib/finance";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "Unknown date" : dateFormatter.format(date);
}

type MetricCardProps = {
  label: string;
  value: number;
  highlight?: "positive" | "negative";
};

function MetricCard({ label, value, highlight }: MetricCardProps) {
  return (
    <Card className="border-slate-200/70 bg-white/90 dark:border-slate-800/60 dark:bg-slate-900/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-2xl font-bold ${
            highlight === "positive"
              ? "text-emerald-500"
              : highlight === "negative"
                ? "text-rose-500"
                : "text-slate-900 dark:text-white"
          }`}
        >
          {currencyFormatter.format(value)}
        </p>
      </CardContent>
    </Card>
  );
}

function EmptyDashboard({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white/80 p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
        Welcome to your LedgerLens dashboard
      </h2>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{message}</p>
      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Use the chat assistant on the home page to log your first income or expense. Your charts and
        summaries will populate automatically once transactions are stored.
      </p>
    </div>
  );
}

async function DashboardBody() {
  try {
    const snapshot = await fetchDashboardSnapshot();
    const { totals, cashFlow, spendingByCategory, transactions, assets } = snapshot;

    const hasTransactions = transactions.length > 0;
    const hasAssets = assets.length > 0;

    return (
      <div className="flex flex-col gap-8">
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Total Income" value={totals.income} highlight="positive" />
          <MetricCard label="Total Expenses" value={totals.expense} highlight="negative" />
          <MetricCard label="Net" value={totals.net} highlight={totals.net >= 0 ? "positive" : "negative"} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200/70 bg-white/90 dark:border-slate-800/60 dark:bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                Cash flow trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CashFlowChart data={cashFlow} />
            </CardContent>
          </Card>

          <Card className="border-slate-200/70 bg-white/90 dark:border-slate-800/60 dark:bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                Spending by category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingByCategoryChart data={spendingByCategory} />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200/70 bg-white/90 dark:border-slate-800/60 dark:bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                Recent transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasTransactions ? (
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {transactions.map((transaction) => {
                    const isIncome = transaction.type === "income";
                    return (
                      <li key={transaction.id} className="flex items-start justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {transaction.description || (isIncome ? "Income" : "Expense")}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {transaction.category ? `${transaction.category} ? ` : ""}
                            {formatDate(transaction.transactionDate)}
                          </p>
                        </div>
                        <p className={`text-sm font-semibold ${isIncome ? "text-emerald-500" : "text-rose-500"}`}>
                          {isIncome ? "+" : "-"}
                          {currencyFormatter.format(transaction.amount)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  No transactions yet. Start logging activity through the chat assistant.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200/70 bg-white/90 dark:border-slate-800/60 dark:bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                Assets overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasAssets ? (
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {assets.map((asset) => (
                    <li key={asset.id} className="flex items-start justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{asset.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {asset.type} ? Updated {formatDate(asset.lastUpdated)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {currencyFormatter.format(asset.currentValue)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Track assets such as savings, investments, or property to see them alongside cash flow.
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Dashboard data error", error);
    const message =
      error instanceof Error
        ? error.message
        : "We could not load your dashboard data. Please verify your Supabase configuration.";

    return (
      <EmptyDashboard message={message || "We could not load your dashboard data."} />
    );
  }
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
            LedgerLens Insights
          </p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Your financial pulse
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Review cash flow, category spending, and asset performance. Everything you log through the
            assistant lands here for quick analysis.
          </p>
        </header>
        <Suspense fallback={<EmptyDashboard message="Loading your dashboard?" />}>
          
          <DashboardBody />
        </Suspense>
      </div>
    </div>
  );
}

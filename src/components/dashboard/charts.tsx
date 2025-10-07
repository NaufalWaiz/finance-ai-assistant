"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

const flowPalette = {
  income: "#0ea5e9",
  expense: "#ef4444",
  net: "#10b981",
};

const categoryPalette = [
  "#6366f1",
  "#14b8a6",
  "#f97316",
  "#ec4899",
  "#22c55e",
  "#06b6d4",
  "#f59e0b",
];

type CashFlowDatum = {
  month: string;
  income: number;
  expense: number;
  net: number;
};

type CashFlowChartProps = {
  data: CashFlowDatum[];
};

type CategoryDatum = {
  category: string;
  amount: number;
};

type SpendingByCategoryChartProps = {
  data: CategoryDatum[];
};

export function CashFlowChart({ data }: CashFlowChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-60 items-center justify-center text-sm text-muted-foreground">
        No transactions yet. Start chatting to see your cash flow history.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={flowPalette.income} stopOpacity={0.35} />
            <stop offset="95%" stopColor={flowPalette.income} stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={flowPalette.expense} stopOpacity={0.35} />
            <stop offset="95%" stopColor={flowPalette.expense} stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={flowPalette.net} stopOpacity={0.45} />
            <stop offset="95%" stopColor={flowPalette.net} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} padding={{ left: 6, right: 6 }} />
        <YAxis tickLine={false} axisLine={false} width={70} />
        <Tooltip formatter={(value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        <Legend verticalAlign="top" height={32} iconType="circle" />
        <Area type="monotone" dataKey="income" stroke={flowPalette.income} fill="url(#incomeGradient)" strokeWidth={2} />
        <Area type="monotone" dataKey="expense" stroke={flowPalette.expense} fill="url(#expenseGradient)" strokeWidth={2} />
        <Area type="monotone" dataKey="net" stroke={flowPalette.net} fill="url(#netGradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SpendingByCategoryChart({ data }: SpendingByCategoryChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-60 items-center justify-center text-sm text-muted-foreground">
        Log a few expenses to unlock category insights.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Tooltip formatter={(value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        <Pie data={data} dataKey="amount" nameKey="category" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((entry, index) => (
            <Cell key={entry.category} fill={categoryPalette[index % categoryPalette.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export type TransactionType = "income" | "expense";

export type TransactionRecord = {
  id: string;
  amount: number;
  type: TransactionType;
  category: string | null;
  description: string | null;
  transactionDate: string;
  createdAt: string;
};

export type CategoryRecord = {
  id: number;
  name: string;
  createdAt: string;
};

export type AssetRecord = {
  id: string;
  name: string;
  type: string;
  currentValue: number;
  lastUpdated: string;
};

export type CashFlowDatum = {
  month: string;
  income: number;
  expense: number;
  net: number;
};

export type SpendingByCategoryDatum = {
  category: string;
  amount: number;
};

export type DashboardSnapshot = {
  totals: {
    income: number;
    expense: number;
    net: number;
  };
  cashFlow: CashFlowDatum[];
  spendingByCategory: SpendingByCategoryDatum[];
  transactions: TransactionRecord[];
  assets: AssetRecord[];
};

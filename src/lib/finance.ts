import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase";
import type {
  AssetRecord,
  CashFlowDatum,
  DashboardSnapshot,
  SpendingByCategoryDatum,
  TransactionRecord,
  TransactionType,
} from "@/types/finance";

type SupabaseAny = SupabaseClient<unknown, unknown, unknown>;

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

function normalizeCategoryName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

type TransactionRow = {
  id: string;
  amount: string | number;
  type: TransactionType;
  description: string | null;
  transaction_date: string;
  created_at: string;
  category: { name: string } | null;
};

type AssetRow = {
  id: string;
  name: string;
  type: string;
  current_value: string | number;
  last_updated: string;
};

const EMPTY_SNAPSHOT: DashboardSnapshot = {
  totals: { income: 0, expense: 0, net: 0 },
  cashFlow: [],
  spendingByCategory: [],
  transactions: [],
  assets: [],
};

async function resolveSupabaseClient(client?: SupabaseAny) {
  return client ?? (await createSupabaseServerClient());
}

export async function getOrCreateCategory(
  userId: string,
  name: string,
  supabaseClient?: SupabaseAny,
) {
  const supabase = await resolveSupabaseClient(supabaseClient);
  const normalized = normalizeCategoryName(name);

  const { data: existingCategory, error: selectError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("user_id", userId)
    .ilike("name", normalized)
    .maybeSingle();

  if (selectError && selectError.code !== "PGRST116") {
    throw new Error(selectError.message);
  }

  if (existingCategory) {
    return existingCategory;
  }

  const { data: insertedCategory, error: insertError } = await supabase
    .from("categories")
    .insert({
      user_id: userId,
      name: normalized,
    })
    .select("id, name")
    .single();

  if (insertError || !insertedCategory) {
    throw new Error(insertError?.message || "Failed to create category");
  }

  return insertedCategory;
}

export async function createTransaction(options: {
  userId: string;
  amount: number;
  type: TransactionType;
  categoryName?: string;
  description?: string;
  transactionDate?: string;
  supabaseClient?: SupabaseAny;
}) {
  const {
    userId,
    amount,
    type,
    categoryName,
    description,
    transactionDate,
    supabaseClient,
  } = options;

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  const supabase = await resolveSupabaseClient(supabaseClient);

  let categoryId: number | null = null;
  let categoryNameResolved: string | null = null;

  if (categoryName && categoryName.trim().length > 0) {
    const category = await getOrCreateCategory(userId, categoryName, supabase);
    categoryId = category.id;
    categoryNameResolved = category.name;
  }

  const parsedDate = transactionDate ? new Date(transactionDate) : new Date();
  const transactionTimestamp = Number.isNaN(parsedDate.valueOf())
    ? new Date()
    : parsedDate;

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      amount,
      type,
      category_id: categoryId,
      description,
      transaction_date: transactionTimestamp.toISOString(),
    })
    .select(
      "id, amount, type, description, transaction_date, created_at, category:categories(name)",
    )
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create transaction");
  }

  const transaction: TransactionRecord = {
    id: data.id,
    amount: Number(data.amount),
    type: data.type,
    description: data.description,
    category: data.category?.name ?? categoryNameResolved,
    transactionDate: data.transaction_date,
    createdAt: data.created_at,
  };

  return transaction;
}

type CashFlowBucket = CashFlowDatum & { key: string };

function buildCashFlow(transactions: TransactionRecord[]): CashFlowDatum[] {
  const now = new Date();
  const buckets = new Map<string, CashFlowBucket>();

  for (let offset = 5; offset >= 0; offset -= 1) {
    const seed = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1),
    );
    const key = `${seed.getUTCFullYear()}-${String(seed.getUTCMonth()).padStart(2, "0")}`;
    buckets.set(key, {
      key,
      month: MONTH_FORMATTER.format(seed),
      income: 0,
      expense: 0,
      net: 0,
    });
  }

  transactions.forEach((transaction) => {
    const date = new Date(transaction.transactionDate);
    if (Number.isNaN(date.valueOf())) {
      return;
    }
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth()).padStart(2, "0")}`;
    if (!buckets.has(key)) {
      buckets.set(key, {
        key,
        month: MONTH_FORMATTER.format(date),
        income: 0,
        expense: 0,
        net: 0,
      });
    }

    const bucket = buckets.get(key)!;
    if (transaction.type === "income") {
      bucket.income += transaction.amount;
      bucket.net += transaction.amount;
    } else {
      bucket.expense += transaction.amount;
      bucket.net -= transaction.amount;
    }
  });

  return Array.from(buckets.values())
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((bucket) => {
      const { key, ...rest } = bucket;
      void key;
      return rest;
    });
}

function buildSpendingByCategory(
  transactions: TransactionRecord[],
): SpendingByCategoryDatum[] {
  const totals = new Map<string, number>();

  transactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      const key = transaction.category ?? "Uncategorized";
      totals.set(key, (totals.get(key) ?? 0) + transaction.amount);
    });

  return Array.from(totals.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

function mapTransactionRows(rows: TransactionRow[]): TransactionRecord[] {
  return rows.map((row) => ({
    id: row.id,
    amount: Number(row.amount),
    type: row.type,
    description: row.description,
    category: row.category?.name ?? null,
    transactionDate: row.transaction_date,
    createdAt: row.created_at,
  }));
}

function mapAssetRows(rows: AssetRow[]): AssetRecord[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    currentValue: Number(row.current_value),
    lastUpdated: row.last_updated,
  }));
}

export async function fetchDashboardSnapshot(): Promise<DashboardSnapshot> {
  const supabase = await createSupabaseServerClient();

  try {
    const [transactionResult, assetResult] = await Promise.all([
      supabase
        .from("transactions")
        .select(
          "id, amount, type, description, transaction_date, created_at, category:categories(name)",
        )
        .order("transaction_date", { ascending: false })
        .limit(50),
      supabase
        .from("assets")
        .select("id, name, type, current_value, last_updated")
        .order("last_updated", { ascending: false }),
    ]);

    if (transactionResult.error) {
      throw transactionResult.error;
    }

    if (assetResult.error) {
      throw assetResult.error;
    }

    const transactions = mapTransactionRows(transactionResult.data ?? []);
    const assets = mapAssetRows(assetResult.data ?? []);

    const totals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.income += transaction.amount;
        } else {
          acc.expense += transaction.amount;
        }
        acc.net = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, net: 0 },
    );

    return {
      totals,
      cashFlow: buildCashFlow(transactions),
      spendingByCategory: buildSpendingByCategory(transactions),
      transactions,
      assets,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch dashboard data.";
    const isAuthIssue =
      message.toLowerCase().includes("no suitable key") ||
      message.toLowerCase().includes("jwt") ||
      message.toLowerCase().includes("auth");

    if (!isAuthIssue) {
      console.error("Dashboard snapshot error:", error);
    }

    return EMPTY_SNAPSHOT;
  }
}

export async function fetchRecentTransactions(limit = 10) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id, amount, type, description, transaction_date, created_at, category:categories(name)",
    )
    .order("transaction_date", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return mapTransactionRows(data ?? []);
}

export async function fetchAssets() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("assets")
    .select("id, name, type, current_value, last_updated")
    .order("last_updated", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return mapAssetRows(data ?? []);
}

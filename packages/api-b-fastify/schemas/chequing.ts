import { z } from "../lib/zod";

export const Currency = z.literal("CAD");

export const Money = z.object({
  amount: z.number(), // demo-friendly; prod often uses integer cents/decimal strings
  currency: Currency,
});

export const AccountStatus = z.enum(["open", "frozen", "closed"]);

export const ChequingAccount = z.object({
  accountId: z.string().min(1),
  customerId: z.string().min(1),
  nickname: z.string().min(1),
  status: AccountStatus,
  balance: Money,
  available: Money,
});

export const ListAccountsResponse = z.object({
  accounts: z.array(ChequingAccount),
});

export const TransactionType = z.enum(["debit", "credit"]);

export const Transaction = z.object({
  transactionId: z.string().min(1),
  accountId: z.string().min(1),
  postedAt: z.string().datetime(),
  type: TransactionType,
  description: z.string().min(1),
  amount: Money,
});

export const ListTransactionsQuery = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  cursor: z.string().optional(),
});

export const ListTransactionsResponse = z.object({
  nextCursor: z.string().optional(),
  transactions: z.array(Transaction),
});

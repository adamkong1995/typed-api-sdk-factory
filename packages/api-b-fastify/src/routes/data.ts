import { ChequingAccount, Transaction } from "../../schemas/chequing";

export const ACCOUNTS: ChequingAccount[] = [
  {
    accountId: "a_2001",
    customerId: "c_1001",
    nickname: "Daily Chequing",
    status: "open",
    balance: { amount: 1250.55, currency: "CAD" },
    available: { amount: 1200.55, currency: "CAD" },
  },
  {
    accountId: "a_2002",
    customerId: "c_1001",
    nickname: "Bills",
    status: "open",
    balance: { amount: 300.0, currency: "CAD" },
    available: { amount: 300.0, currency: "CAD" },
  },
  {
    accountId: "a_2003",
    customerId: "c_1002",
    nickname: "Chequing",
    status: "frozen",
    balance: { amount: 980.1, currency: "CAD" },
    available: { amount: 0.0, currency: "CAD" },
  },
];

export const TRANSACTIONS: Transaction[] = [
  {
    transactionId: "t_9001",
    accountId: "a_2001",
    postedAt: "2026-01-15T18:30:00.000Z",
    type: "debit",
    description: "Grocery Store",
    amount: { amount: 54.23, currency: "CAD" },
  },
  {
    transactionId: "t_9002",
    accountId: "a_2001",
    postedAt: "2026-01-14T09:00:00.000Z",
    type: "credit",
    description: "Payroll",
    amount: { amount: 2200.0, currency: "CAD" },
  },
  {
    transactionId: "t_9003",
    accountId: "a_2001",
    postedAt: "2026-01-13T20:10:00.000Z",
    type: "debit",
    description: "Coffee",
    amount: { amount: 4.75, currency: "CAD" },
  },
  {
    transactionId: "t_9101",
    accountId: "a_2002",
    postedAt: "2026-01-10T12:00:00.000Z",
    type: "debit",
    description: "Utilities",
    amount: { amount: 120.0, currency: "CAD" },
  },
];

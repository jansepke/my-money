import { Transaction } from "@/domain";
import { green, red } from "@mui/material/colors";
import dayjs from "dayjs";

// https://stackoverflow.com/a/53107408/1453662
export const parseGoogleSheetsDate = (value: number) => new Date(value * 86400000 - 2209132800000);
export const formatDate = (value: Date) => value.toLocaleDateString("de-DE", { dateStyle: "medium" });

const numberFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
export const formatCurrency = (value: number) => numberFormat.format(value);
export const currencyColor = (value: number) => (value < 0 ? red[400] : green[700]);

export function sum(transactions: Pick<Transaction, "amount">[]) {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

export const filterByMonth = (year: number, month: number) => {
  const startDate = dayjs(`${year}-${month}-1`);
  const endDate = startDate.endOf("month");

  return (t: Transaction) => {
    const date = parseGoogleSheetsDate(t.date);
    return date > startDate.toDate() && date < endDate.toDate();
  };
};

export const filterForMainAccount = (t: Transaction) => (t.from && !t.to) || (t.to === 1 && !t.from);

export const filterForOtherAccounts = (t: Transaction) => t.from !== 1 || t.to !== 1;

export const filterForOtherAccount = (accountId: number) => (t: Transaction) =>
  t.from === accountId || t.to === accountId;

export const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const response = await fetch(input, init);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HTTP error ${response.status} with body ${body}`);
  }

  return response;
};

export const customFetchJson = async (input: RequestInfo | URL, init?: RequestInit) => {
  const response = await customFetch(input, init);

  return response.json();
};
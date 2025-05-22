"use client";

import { trpc } from "@frontend/lib/trpc";
import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";

export default function DashboardTable() {
  const { data: transactions = [] } = trpc.getTransactions.useQuery();
  const [search, setSearch] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  }, [transactions]); // Automatically scroll to the bottom when transactions are updated

  const utils = trpc.useUtils();

  trpc.transactionUpdates.useSubscription(undefined, {
    onData(tx) {
      utils.getTransactions.setData(undefined, (old) => [...(old ?? []), tx]);
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollTop = tableRef.current.scrollHeight;
        }
      }, 100);
    },
    onError(err) {
      console.error("Subscription error:", err);
    },
  });

  const filteredTransactions = useMemo(() => {
    if (!search) return transactions; // Show all if no search

    return transactions.filter((tx) =>
      tx.name.toLowerCase().startsWith(search.toLowerCase())
    );
  }, [search, transactions]);

  const totalRevenue = useMemo(() => {
    // Group transactions by currency and sum amounts
    const totals = transactions.reduce((acc, tx) => {
      const current = acc[tx.currency] || 0;
      acc[tx.currency] = current + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    return totals;
  }, [transactions]);

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "JPY":
        return "¥";
      default:
        return currency;
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <Link href="/dashboard" className="block">
        <h1 className="text-2xl font-bold mb-4 text-center hover:text-indigo-600 transition-colors">
          📊 Sales Dashboard
        </h1>
      </Link>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name..."
          className="form-input w-full"
        />
      </div>

      <div ref={tableRef} className="flex-1 overflow-y-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="text-xs uppercase text-gray-500 sticky top-0 bg-white z-10">
            <tr>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Customer Name</th>
              <th className="py-2 px-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} className="border-t">
                <td className="py-2 px-4 text-gray-600">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">{tx.name}</td>
                <td className="py-2 px-4 font-medium">
                  {getCurrencySymbol(tx.currency)}
                  {tx.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t text-sm text-gray-600">
        {Object.entries(totalRevenue).map(([currency, amount]) => (
          <div key={currency} className="text-right">
            Total Revenue ({currency}): {getCurrencySymbol(currency)}
            {amount.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}

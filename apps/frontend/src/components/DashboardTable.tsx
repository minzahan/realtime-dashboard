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
  }, [transactions]);

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
      console.error("❌ Subscription error:", err);
    },
  });

  const filtered = useMemo(() => {
    return transactions.filter((tx) =>
      tx.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, transactions]);

  const totalRevenue = useMemo(() => {
    return filtered.reduce((sum, tx) => sum + tx.amount, 0);
  }, [filtered]);

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

      <div className="mb-4 text-right text-lg font-semibold">
        Total Revenue: ${totalRevenue.toFixed(2)}
      </div>

      <div ref={tableRef} className="flex-1 overflow-y-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="text-xs uppercase text-gray-500 sticky top-0 bg-white z-10">
            <tr>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Customer</th>
              <th className="py-2 px-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx, i) => (
              <tr key={i} className="border-t">
                <td className="py-2 px-4 text-gray-600">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">{tx.name}</td>
                <td className="py-2 px-4 font-medium">
                  ${tx.amount.toFixed(2)} {tx.currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

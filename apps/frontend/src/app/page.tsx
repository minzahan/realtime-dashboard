"use client";

import { trpc } from "@frontend/lib/trpc";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  // 1. Initial load from mock-db
  const { data: initialTxs = [] } = trpc.getTransactions.useQuery();

  useEffect(() => {
    if (initialTxs) {
      setTransactions(initialTxs);
    }
  }, [initialTxs]);

  // 2. Live updates via subscription
  trpc.transactionUpdates.useSubscription(undefined, {
    onData(tx) {
      setTransactions((prev) => [...prev, tx]);
    },
    onError(err) {
      console.error("❌ Subscription error:", err);
    },
  });

  // 3. Mutation to add new transactions
  const addTx = trpc.addTransaction.useMutation();

  return (
    <main className="p-6 space-y-4">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() =>
          addTx.mutate({
            name: "Shend",
            amount: Math.floor(Math.random() * 100),
            currency: "USD",
          })
        }
      >
        ➕ Add Transaction
      </button>

      <ul className="space-y-2">
        {transactions.map((tx, i) => (
          <li key={i}>
            💰 {tx.name} — {tx.amount} {tx.currency}
          </li>
        ))}
      </ul>
    </main>
  );
}

"use client";

import { trpc } from "@frontend/lib/trpc";
import { useState } from "react";
import Link from "next/link";

export default function TransactionForm() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");

  const addTx = trpc.addTransaction.useMutation({
    onSuccess: () => {
      setName("");
      setAmount("");
      setCurrency("USD");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !currency) return;
    addTx.mutate({
      name,
      amount: parseFloat(amount),
      currency,
    });
  };

  return (
    <div className="card">
      <Link href="/transaction" className="block">
        <h1 className="text-2xl font-bold mb-4 text-center hover:text-indigo-600 transition-colors">
          💰 Add Transaction
        </h1>
      </Link>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Customer Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="e.g. Jane Doe"
            required
          />
        </div>
        <div>
          <label className="form-label">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            placeholder="e.g. 100.00"
            required
          />
        </div>
        <div>
          <label className="form-label">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="form-input"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>
        <button type="submit" className="btn-primary mt-4">
          Submit
        </button>
      </form>
    </div>
  );
}

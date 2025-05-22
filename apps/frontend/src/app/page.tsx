"use client";

import DashboardTable from "@frontend/components/DashboardTable";
import TransactionForm from "@frontend/components/TransactionForm";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <div className="h-[600px] flex flex-col">
          <DashboardTable />
        </div>
        <div className="h-[600px]">
          <TransactionForm />
        </div>
      </div>
    </div>
  );
}

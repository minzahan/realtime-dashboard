"use client";

import DashboardTable from "@frontend/components/DashboardTable";

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="h-[800px] overflow-hidden">
        <DashboardTable />
      </div>
    </div>
  );
}

"use client";

import { trpc } from "@frontend/lib/trpc";
import { useState } from "react";

export default function Home() {
  const { data } = trpc.healthcheck.useQuery();
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>TRPC says: {data}</h1>
      <button onClick={() => setCount(count + 1)}>Click {count}</button>
    </main>
  );
}

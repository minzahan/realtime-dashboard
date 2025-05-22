"use client";

import { createTRPCReact } from "@trpc/react-query";
import {
  httpBatchLink,
  createWSClient,
  wsLink,
  createTRPCClient,
} from "@trpc/client";
import type { AppRouter } from "trpc/router";

export const trpc = createTRPCReact<AppRouter>(); // AppRouter type ensures all API calls match the backend

const wsClient = createWSClient({
  url: "ws://localhost:3002",
});

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    wsLink({ client: wsClient }),
    httpBatchLink({ url: "http://localhost:3001/trpc" }),
  ],
});

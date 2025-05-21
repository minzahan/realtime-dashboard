import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "trpc/router"; // from packages

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    loggerLink(),
    httpBatchLink({
      url: "http://localhost:3001/trpc",
    }),
  ],
});

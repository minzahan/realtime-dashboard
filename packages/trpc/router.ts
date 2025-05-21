import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const appRouter = t.router({
  healthcheck: t.procedure.query(() => "OK, It's working"),
});

export type AppRouter = typeof appRouter;

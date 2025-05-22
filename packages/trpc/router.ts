import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import z from "zod";
import { saveTransaction, getAllTransactions } from "backend/src/db";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const transactionInput = z.object({
  name: z.string(),
  amount: z.number(),
  currency: z.string(),
});

export type Transaction = z.infer<typeof transactionInput> & { date: string };

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "OK"),

  getTransactions: publicProcedure.query(async () => {
    return await getAllTransactions();
  }),

  addTransaction: publicProcedure
    .input(transactionInput)
    .mutation(async ({ input, ctx }) => {
      const tx: Transaction = {
        ...input,
        date: new Date().toISOString(),
      };
      await saveTransaction(tx);
      ctx.txEmitter.emit("newTx", tx);
      return tx;
    }),

  transactionUpdates: publicProcedure.subscription(({ ctx }) => {
    // total chatgpt question on how to set up
    return (async function* () {
      const queue: Transaction[] = [];

      const listener = (tx: Transaction) => queue.push(tx);
      ctx.txEmitter.on("newTx", listener);

      try {
        while (true) {
          if (queue.length === 0) {
            await new Promise((resolve) => setTimeout(resolve, 50)); // polling gap
            continue;
          }

          yield queue.shift()!;
        }
      } finally {
        ctx.txEmitter.off("newTx", listener);
      }
    })();
  }),
});

export type AppRouter = typeof appRouter;

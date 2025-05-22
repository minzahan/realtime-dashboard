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

export type Transaction = z.infer<typeof transactionInput> & {
  date: string;
  id: string;
};

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "OK"),

  getTransactions: publicProcedure.query(async () => {
    return await getAllTransactions();
  }), // to load existing transactions

  addTransaction: publicProcedure // new public procedure
    .input(transactionInput) // input validation
    .mutation(async ({ input, ctx }) => {
      // mutation that receives input data and
      const tx: Transaction = {
        id: crypto.randomUUID(),
        ...input,
        date: new Date().toISOString(),
      };
      await saveTransaction(tx);
      ctx.txEmitter.emit("newTx", tx);
      return tx;
    }),

  transactionUpdates: publicProcedure.subscription(({ ctx }) => {
    // subscription that returns a stream of transactions
    return (async function* () {
      // return an async generator function that yields values as they are emitted over time
      let resolveNext: ((tx: Transaction) => void) | null = null; // resolveNext will be called when a new transaction is emitted - initially null

      const listener = (tx: Transaction) => {
        // listener called when a new transaction is emitted
        if (resolveNext) {
          // if there is a promise waiting
          resolveNext(tx); // resolve the promise with the new transaction
          resolveNext = null; // reset resolveNext
        }
      };

      ctx.txEmitter.on("newTx", listener);

      try {
        while (true) {
          const tx = await new Promise<Transaction>((resolve) => {
            // create a promise that will be resolved when a new transaction is emitted
            resolveNext = resolve; // set resolveNext to the resolve function
          });
          yield tx; // yield the transaction
        }
      } finally {
        ctx.txEmitter.off("newTx", listener);
      }
    })();
  }),
});

export type AppRouter = typeof appRouter;

import { txEmitter } from "./emitter";

export const createContext = () => ({
  txEmitter,
});

export type Context = Awaited<ReturnType<typeof createContext>>;

import { txEmitter } from "./emitter";

export const createContext = () => ({
  txEmitter,
}); // createsContext object with txEmitter to place on all API calls

export type Context = Awaited<ReturnType<typeof createContext>>;

// Other useful context items:
// - user authentication
// - database connection
// - logging
// - request id

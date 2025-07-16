import { AsyncLocalStorage } from "node:async_hooks";

// define the shape of the context
export interface Context {
  request?: Request;
  // add more fields as needed
}

const context = new AsyncLocalStorage<Context>();

export const runWithContext = <T>(ctx: Context, fn: () => T): T =>
  context.run(ctx, fn);

export const getContext = (): Context | undefined => context.getStore();

export const getContextRequest = (): Request | undefined =>
  getContext()?.request;

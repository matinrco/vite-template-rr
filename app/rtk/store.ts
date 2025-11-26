import {
  type RouterContextProvider,
  type MiddlewareFunction,
  type DataStrategyResult,
  createContext,
  useMatches,
} from "react-router";
import {
  type ThunkAction,
  type UnknownAction,
  type ActionCreatorInvariantMiddlewareOptions,
  type ImmutableStateInvariantMiddlewareOptions,
  type SerializableStateInvariantMiddlewareOptions,
  configureStore,
  createAction,
  combineSlices,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { isBrowser } from "~/utils/environment";
import { HYDRATE_ACTION, HYDRATE_STATE_KEY } from "./constants";
import { slice as postApiSlice } from "./query/post/slice";
import { slice as weatherApiSlice } from "./query/weather/slice";
import { slice as sharedSlice } from "./slices/shared";

/**
 * you can add any other value here if you want to make it accessible in rtk context.
 */
export type Context = { request?: Request };

type ThunkOptions<E> = {
  extraArgument: E;
};

type DefaultMiddlewareOptions = {
  thunk?: boolean | ThunkOptions<Context>;
  immutableCheck?: boolean | ImmutableStateInvariantMiddlewareOptions;
  serializableCheck?: boolean | SerializableStateInvariantMiddlewareOptions;
  actionCreatorCheck?: boolean | ActionCreatorInvariantMiddlewareOptions;
};

/**
 * we need to create APP_HYDRATE before calling combineSlices
 * cuz we use APP_HYDRATE in slices. prevent shitty circular dependency!
 */
export const APP_HYDRATE = createAction<RootState>(HYDRATE_ACTION);

const reducer = combineSlices(postApiSlice, weatherApiSlice, sharedSlice);

const makeStore = (context: Context) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware<DefaultMiddlewareOptions>({
        thunk: {
          extraArgument: context,
        },
      }).concat(postApiSlice.middleware, weatherApiSlice.middleware),
  });

type AppStore = ReturnType<typeof makeStore>;
type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;

// use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

/**
 * used to access react router context to get store.
 */
const rtkContext = createContext<AppStore | null>(null);

class StoreNotFoundError extends Error {}

export const getStoreFromContext = (
  context: Readonly<RouterContextProvider>,
): AppStore => {
  const store = context.get(rtkContext);
  if (!store) {
    throw new StoreNotFoundError("store not found in current context");
  }
  return store;
};

let clientStore: AppStore | undefined;

export const getClientStore = (): AppStore => {
  if (isBrowser) {
    if (!clientStore) {
      clientStore = makeStore({});
    }
    return clientStore;
  } else {
    throw new StoreNotFoundError(
      "you should not use getClientStore in server side!",
    );
  }
};

export const rtkMiddleware: {
  client: MiddlewareFunction<Record<string, DataStrategyResult>>;
  server: MiddlewareFunction<Response>;
} = {
  client: async ({ context }, next) => {
    if (!context.get(rtkContext)) {
      context.set(rtkContext, getClientStore());
    }
    return await next();
  },
  server: async ({ context, request }, next) => {
    if (!context.get(rtkContext)) {
      context.set(rtkContext, makeStore({ request }));
    }
    return await next();
  },
};

let lastHydrationKey = "";

export const useHydrateStore = () => {
  const matches = useMatches();
  const dispatch = useAppDispatch();

  const incomingStores = matches
    .map(
      (match) => (match.loaderData as never)?.[HYDRATE_STATE_KEY] as RootState,
    )
    .filter(Boolean);

  if (incomingStores.length === 0) return;

  // build a stable key to detect unique hydration data
  const currentKey = JSON.stringify(incomingStores);

  if (currentKey === lastHydrationKey) return;

  incomingStores.forEach((incomingStore) => {
    dispatch(APP_HYDRATE(incomingStore));
  });

  // eslint-disable-next-line react-hooks/globals
  lastHydrationKey = currentKey;
};

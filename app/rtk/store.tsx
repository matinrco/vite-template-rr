import { type FC, useState } from "react";
import {
  type data,
  type redirect,
  type unstable_RouterContextProvider as RouterContextProvider,
  type unstable_MiddlewareFunction as MiddlewareFunction,
  unstable_createContext as createContext,
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
import { isServer } from "~/utils/environment";
import { api } from "~/rtk/query";
import { HYDRATE_ACTION, HYDRATE_STATE_KEY } from "./constants";
import { slice as sharedSlice } from "./slices/shared";

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
 * cuz we use APP_HYDRATE in slices
 */
export const APP_HYDRATE = createAction<RootState>(HYDRATE_ACTION);

const reducer = combineSlices(api, sharedSlice);

const makeStore = (context: Context) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware<DefaultMiddlewareOptions>({
        thunk: {
          extraArgument: context,
        },
      }).concat(api.middleware),
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

// from here 👇👇👇👇 till end, needs reconsideration

const serverStoreContext = createContext<AppStore | null>(null);

let clientStore: AppStore | undefined;

export const ensureStore = ({
  context,
  request,
}: {
  context?: RouterContextProvider;
  request?: Request;
}) => {
  if (isServer && context) {
    let serverStore: AppStore | null = null;
    serverStore = context.get(serverStoreContext);
    if (serverStore) {
      return serverStore;
    } else {
      // create new store and put into server context then return it
      context.set(serverStoreContext, makeStore({ request }));
      serverStore = context.get(serverStoreContext);
      if (serverStore) {
        return serverStore;
      } else {
        throw new Error("Store is not available in current context");
      }
    }
  } else {
    // its client here
    if (!clientStore) {
      clientStore = makeStore({});
      return clientStore;
    } else {
      return clientStore;
    }
  }
};

export const rtkMiddleware: MiddlewareFunction<Response> = async (
  { context, request },
  next,
) => {
  ensureStore({ context, request });
  return await next();
};

export const wrapRouterFn = <
  Args extends { request?: Request; context?: RouterContextProvider },
  T extends
    | object
    | ReturnType<typeof redirect>
    | ReturnType<typeof data>
    | void = void,
>(
  callback: (store: AppStore, args: Args) => Promise<T>,
) => {
  return async (args: Args) => {
    const store = ensureStore({
      context: args.context,
      request: args.request,
    });
    const result = await callback(store, args);

    if (result instanceof Response) {
      /**
       * output is a http response and we cant do shit!
       * just pass it through
       * this might be a simple react router redirect
       */
      return result;
    } else if (
      typeof result === "object" &&
      result !== null &&
      "init" in result
    ) {
      /**
       * its react router `data()` output
       * we need to attach hydrated state
       */
      return {
        ...result,
        data:
          result.data && typeof result.data === "object" && result.data !== null
            ? { ...result.data, [HYDRATE_STATE_KEY]: store.getState() }
            : { [HYDRATE_STATE_KEY]: store.getState() },
      };
    } else {
      /**
       * its normal object data output
       * no special handling needed
       */
      return {
        ...result,
        [HYDRATE_STATE_KEY]: store.getState(),
      };
    }
  };
};

export const wrapRouterComponent = <TProps extends object>(
  Component: FC<TProps>,
): FC<TProps> => {
  const WrappedComponent = (props: TProps) => {
    const dispatch = useAppDispatch();
    const [isHydrated, setIsHydrated] = useState(false);

    // check if props contain state from loader/action
    if (
      "loaderData" in props &&
      typeof props.loaderData === "object" &&
      props.loaderData !== null &&
      HYDRATE_STATE_KEY in props.loaderData
    ) {
      if (!isHydrated) {
        dispatch(APP_HYDRATE(props.loaderData[HYDRATE_STATE_KEY] as RootState));
        setIsHydrated(true);
      }
    }

    return <Component {...props} />;
  };

  return WrappedComponent;
};

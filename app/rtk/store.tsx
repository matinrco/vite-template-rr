import { type FC, useState } from "react";
import {
  type ActionFunctionArgs,
  type ClientActionFunctionArgs,
  type ClientLoaderFunctionArgs,
  type LoaderFunctionArgs,
  data,
  redirect,
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
import { HYDRATE_ACTION, HYDRATE_STATE_KEY } from "~/rtk/constants";
import { api } from "~/rtk/query";
import { slice as sharedSlice } from "~/rtk/slices/shared";

export type Context =
  | LoaderFunctionArgs
  | ClientLoaderFunctionArgs
  | ActionFunctionArgs
  | ClientActionFunctionArgs;

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

const makeStore = (context?: Context, preloadedState?: RootState) =>
  configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware<DefaultMiddlewareOptions>(
        context && {
          thunk: {
            extraArgument: context,
          },
        },
      ).concat(api.middleware),
  });

type AppStore = ReturnType<typeof makeStore>;
type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<typeof reducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;

// store singleton
let storeInstance: AppStore | undefined;

const setupStoreInstance = (context?: Context, preloadedState?: RootState) => {
  storeInstance = makeStore(context, preloadedState);
};

export const ensureStoreInstance = (
  context?: Context,
  preloadedState?: RootState,
) => {
  if (!storeInstance) {
    storeInstance = makeStore(context, preloadedState);
  }

  return storeInstance;
};

// use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const wrapRouterFn = <
  Args extends Context,
  T extends
    | object
    | ReturnType<typeof redirect>
    | ReturnType<typeof data>
    | void = void,
>(
  callback: (store: AppStore, args: Args) => Promise<T>,
) => {
  return async (args: Args) => {
    const store = ensureStoreInstance(args);
    const result = await callback(store, args);
    const state = store.getState();

    if (result instanceof Response) {
      // Handle redirects or other Response objects
      return result;
    } else if (
      typeof result === "object" &&
      result !== null &&
      "init" in result
    ) {
      // Handle react-router data() responses
      return {
        ...result,
        data:
          result.data && typeof result.data === "object" && result.data !== null
            ? { ...result.data, [HYDRATE_STATE_KEY]: state }
            : { [HYDRATE_STATE_KEY]: state },
      };
    } else {
      // Handle regular object responses
      return {
        ...result,
        [HYDRATE_STATE_KEY]: state,
      };
    }
  };
};

export const wrapRouterRootFn = <
  Args extends Context,
  T extends
    | object
    | ReturnType<typeof redirect>
    | ReturnType<typeof data>
    | void = void,
>(
  callback: (store: AppStore, args: Args) => Promise<T>,
) => {
  return async (args: Args) => {
    if (typeof window === "undefined") {
      setupStoreInstance(args);
    }
    const store = ensureStoreInstance(args);

    return await callback(store, args);
  };
};

export const withHydration = <TProps extends object>(
  Component: FC<TProps>,
): FC<TProps> => {
  const WrappedComponent = (props: TProps) => {
    const store = ensureStoreInstance();
    const [isHydrated, setIsHydrated] = useState(false);

    // check if props contain state from loader/action
    if (
      "loaderData" in props &&
      typeof props.loaderData === "object" &&
      props.loaderData !== null &&
      HYDRATE_STATE_KEY in props.loaderData
    ) {
      if (!isHydrated) {
        store.dispatch(
          APP_HYDRATE(props.loaderData[HYDRATE_STATE_KEY] as RootState),
        );
        setIsHydrated(true);
      }
    }

    return <Component {...props} />;
  };

  return WrappedComponent;
};

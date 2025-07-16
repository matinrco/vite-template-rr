import type { FC } from "react";
import {
  dehydrate,
  HydrationBoundary,
  isServer,
  QueryClient,
} from "@tanstack/react-query";
import { data, redirect } from "react-router";

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity } },
  });
};

let browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = () => {
  if (isServer) {
    // server: always make a new query client
    return makeQueryClient();
  } else {
    // browser: make a new query client if we don't already have one
    // this is very important, so we don't re-make a new client if react
    // suspends during the initial render. this may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
};

export const withQueryClient = <
  Args,
  T extends
    | object
    | ReturnType<typeof redirect>
    | ReturnType<typeof data>
    | void = void,
>(
  callback: (queryClient: QueryClient, args: Args) => Promise<T>,
) => {
  return async (args: Args) => {
    const queryClient = getQueryClient();
    const result = await callback(queryClient, args);

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
       * we need to attach dehydratedState
       */
      return {
        ...result,
        data:
          result.data && typeof result.data === "object" && result.data !== null
            ? { ...result.data, dehydratedState: dehydrate(queryClient) }
            : { dehydratedState: dehydrate(queryClient) },
      };
    } else {
      /**
       * its normal object data output
       * no special handling needed
       */
      return {
        ...result,
        dehydratedState: dehydrate(queryClient),
      };
    }
  };
};

export const withHydration = <TProps extends object>(
  Component: FC<TProps>,
): FC<TProps> => {
  const WrappedComponent = (props: TProps) => {
    return (
      <HydrationBoundary
        state={
          "loaderData" in props &&
          typeof props.loaderData === "object" &&
          props.loaderData !== null &&
          "dehydratedState" in props.loaderData
            ? props.loaderData.dehydratedState
            : undefined
        }
      >
        <Component {...(props as TProps)} />
      </HydrationBoundary>
    );
  };

  return WrappedComponent;
};

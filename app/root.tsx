import type { FC, PropsWithChildren } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

/**
 * the Layout component is a special export for the root route.
 * it acts as your document's "app shell" for all route components, HydrateFallback, and ErrorBoundary
 */
export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

/**
 * on initial page load, the route component renders only after the client loader is finished.
 * if exported, a HydrateFallback can render immediately in place of the route component.
 */
export const HydrateFallback: FC<Route.HydrateFallbackProps> = () => (
  <p>loading ...</p>
);

/**
 * the top most error boundary for the app, rendered when your app throws an error
 */
export const ErrorBoundary: FC<Route.ErrorBoundaryProps> = ({ error }) => {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
};

export default Outlet;

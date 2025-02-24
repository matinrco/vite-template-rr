import type { FC, PropsWithChildren } from "react";
import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next/react";
import {
  ColorSchemeScript,
  DirectionProvider,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { i18nServer, localeCookie } from "~/locales/i18nServer";
import { createTheme } from "~/utils/createTheme";
import type { Route } from "./+types/root";
import "./app.css";

export const handle = {
  /**
   * we can add a i18n key with namespaces will need to load
   * this key can be a single string or an array of strings.
   */
  i18n: "common",
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const locale = await i18nServer.getLocale(request);

  return data(
    {
      locale,
    },
    {
      headers: {
        "Set-Cookie": await localeCookie.serialize(locale),
      },
    },
  );
};

/**
 * the Layout component is a special export for the root route.
 * it acts as your document's "app shell" for all route components, HydrateFallback, and ErrorBoundary
 */
export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();

  /**
   * this hook will change the i18n instance language to the current locale
   * detected by the loader, this way, when we do something to change the
   * language, this locale will change and i18next will load the correct
   * translation files
   */
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()} {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        <DirectionProvider initialDirection={i18n.dir()}>
          <MantineProvider theme={createTheme({ dir: i18n.dir() })}>
            {children}
          </MantineProvider>
        </DirectionProvider>
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

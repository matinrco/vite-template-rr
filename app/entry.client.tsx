import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import i18n from "i18next";
import {
  I18nextProvider as I18nProvider,
  initReactI18next as i18nPluginInitReact,
} from "react-i18next";
import i18nPluginBrowserLanguageDetector from "i18next-browser-languagedetector";
import i18nPluginHttpBackend from "i18next-http-backend";
import { getInitialNamespaces } from "remix-i18next/client";
import { i18nConfig } from "~/locales/i18nConfig";

const hydrate = async () => {
  await i18n
    // tell i18next to use the react-i18next plugin
    .use(i18nPluginInitReact)
    // setup a client-side language detector
    .use(i18nPluginBrowserLanguageDetector)
    // setup your backend
    .use(i18nPluginHttpBackend)
    .init({
      // spread the configuration
      ...i18nConfig,
      // this function detects the namespaces your routes rendered while SSR use
      ns: getInitialNamespaces(),
      backend: { loadPath: "/api/locales/{{lng}}/{{ns}}" },
      detection: {
        /**
         * here only enable htmlTag detection, we'll detect the language only
         * server-side with remix-i18next, by using the `<html lang>` attribute
         * we can communicate to the client the language detected server-side
         */
        order: ["htmlTag"],
        /**
         * because we only use htmlTag, there's no reason to cache the language
         * on the browser, so we disable it
         */
        caches: [],
      },
    });

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nProvider i18n={i18n}>
        <StrictMode>
          <HydratedRouter />
        </StrictMode>
      </I18nProvider>,
    );
  });
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}

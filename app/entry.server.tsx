import { PassThrough } from "node:stream";
import { resolve } from "node:path";
import { type EntryContext, ServerRouter } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import {
  type RenderToPipeableStreamOptions,
  renderToPipeableStream,
} from "react-dom/server";
import { isbot } from "isbot";
import { createInstance as createI18nInstance } from "i18next";
import {
  I18nextProvider as I18nProvider,
  initReactI18next as i18nPluginInitReact,
} from "react-i18next";
import i18nPluginFsBackend from "i18next-fs-backend";
import { i18nConfig } from "~/locales/i18nConfig";
import { i18nServer } from "~/locales/i18nServer";

export const streamTimeout = 5_000;

const handleRequest = async (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) => {
  const i18nInstance = createI18nInstance();
  const lng = await i18nServer.getLocale(request);
  const ns = i18nServer.getRouteNamespaces(routerContext);

  await i18nInstance
    // tell our instance to use react-i18next
    .use(i18nPluginInitReact)
    // setup our backend
    .use(i18nPluginFsBackend)
    .init({
      // spread the configuration
      ...i18nConfig,
      // the locale we detected above
      lng,
      // the namespaces the routes about to render wants to use
      ns,
      backend: { loadPath: resolve("./app/locales/{{lng}}/{{ns}}.json") },
    });

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");

    // ensure requests from bots and SPA Mode renders wait for all content to load before responding
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode
        ? "onAllReady"
        : "onShellReady";

    const { pipe, abort } = renderToPipeableStream(
      <I18nProvider i18n={i18nInstance}>
        <ServerRouter context={routerContext} url={request.url} />
      </I18nProvider>,
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    // abort the rendering stream after the `streamTimeout` so it has time to
    // flush down the rejected boundaries
    setTimeout(abort, streamTimeout + 1000);
  });
};

export default handleRequest;

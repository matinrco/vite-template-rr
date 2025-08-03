import { PassThrough } from "node:stream";
import {
  type EntryContext,
  type unstable_RouterContextProvider as RouterContextProvider,
  ServerRouter,
} from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import {
  type RenderToPipeableStreamOptions,
  renderToPipeableStream,
} from "react-dom/server";
import { isbot } from "isbot";
import { I18nextProvider as I18nProvider } from "react-i18next";
import { Provider as ReactReduxProvider } from "react-redux";
import { getI18nInstance } from "~/locales/i18nServer";
import { getStoreFromContext } from "~/rtk/store";

export const streamTimeout = 5_000;

const handleRequest = async (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext,
  routerContext: RouterContextProvider,
) => {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");

    // ensure requests from bots and SPA Mode renders wait for all content to load before responding
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || entryContext.isSpaMode
        ? "onAllReady"
        : "onShellReady";

    const { pipe, abort } = renderToPipeableStream(
      <I18nProvider i18n={getI18nInstance(routerContext)}>
        <ReactReduxProvider store={getStoreFromContext(routerContext)}>
          <ServerRouter context={entryContext} url={request.url} />
        </ReactReduxProvider>
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

import { data } from "react-router";
import { z } from "zod";
import { i18nConfig } from "~/locales/i18nConfig";
import { resources } from "~/locales/i18nServer";
import type { Route } from "./+types/api.locales.$locale.$namespace";

export const loader = ({ params }: Route.LoaderArgs) => {
  const locale = z
    .string()
    .refine((locale: string) =>
      (i18nConfig.supportedLngs as string[]).includes(locale),
    )
    .parse(params.locale);

  const namespace = z.string().parse(params.namespace);

  return data(resources[locale][namespace]);
};

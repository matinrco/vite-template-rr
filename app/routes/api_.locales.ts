import { resolve } from "node:path";
import fs from "fs";
import { z } from "zod";
import { i18nConfig } from "~/locales/i18nConfig";
import type { Route } from "./+types/api_.locales";

export const loader = ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);

  // TODO: error handle this file + more stricter validation

  const locale = z
    .string()
    .refine((locale: string) =>
      (i18nConfig.supportedLngs as string[]).includes(locale),
    )
    .parse(url.searchParams.get("locale"));

  const namespace = z.string().parse(url.searchParams.get("namespace"));

  const filePath = resolve(`./app/locales/${locale}/${namespace}.json`);

  if (!fs.existsSync(filePath)) {
    // we have error here - file not found
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(fileContents);
};

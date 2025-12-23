import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { Route } from "./+types/about";

export const meta: Route.MetaFunction = () => [
  {
    title: "about page",
  },
  { name: "description", content: "this is about page" },
];

export const links: Route.LinksFunction = () => [];

const Component: FC<Route.ComponentProps> = () => {
  const { t } = useTranslation(["about", "common"]);

  return <p>this is about page {t("common:greetings")}</p>;
};

export default Component;

import type { FC } from "react";
import type { Route } from "./+types/about";
import { useTranslation } from "react-i18next";

export const handle = {
  i18n: ["about"],
};

export const meta: Route.MetaFunction = () => [
  {
    title: "about page",
  },
  { name: "description", content: "this is about page" },
];

export const links: Route.LinksFunction = () => [];

const Component: FC<Route.ComponentProps> = () => {
  const { t } = useTranslation();

  return <p>this is about page {t("greetings")}</p>;
};

export default Component;

import type { Route } from "./+types/_index";

export const meta: Route.MetaFunction = ({}) => [
  {
    title: "root page",
  },
  { name: "description", content: "welcome" },
];

export const links: Route.LinksFunction = () => [];

export default () => <p>this is root page</p>;

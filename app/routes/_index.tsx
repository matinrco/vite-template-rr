import type { Route } from "./+types/_index";

export const meta: Route.MetaFunction = () => [
  {
    title: "index page",
  },
  { name: "description", content: "welcome" },
];

export const links: Route.LinksFunction = () => [];

const Index = () => <p>this is index page</p>;

export default Index;

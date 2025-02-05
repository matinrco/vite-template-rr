import type { FC } from "react";
import type { Route } from "./+types/about";

export const meta: Route.MetaFunction = () => [
  {
    title: "about page",
  },
  { name: "description", content: "this is about page" },
];

export const links: Route.LinksFunction = () => [];

const About: FC<Route.ComponentProps> = () => <p>this is about page</p>;

export default About;

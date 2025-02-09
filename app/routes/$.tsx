import type { FC } from "react";
import { data } from "react-router";
import type { Route } from "./+types/$";

export const loader = () => {
  throw data({}, { status: 404 });
};

const Component: FC<Route.ComponentProps> = () => <></>;

export default Component;

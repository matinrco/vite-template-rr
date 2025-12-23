import type { FC } from "react";
import { HYDRATE_STATE_KEY } from "~/rtk/constants";
import { postApis } from "~/rtk/query/post";
import { getStoreFromContext } from "~/rtk/store";
import type { Route } from "./+types/posts_.$id";

export const meta: Route.MetaFunction = ({ loaderData, params: { id } }) => [
  {
    title: loaderData?.post
      ? loaderData?.post?.title || "---"
      : `Post not found`,
  },
  {
    name: "description",
    content: loaderData?.post
      ? loaderData?.post?.body || "---"
      : `Post ${id} not found`,
  },
];

export const links: Route.LinksFunction = () => [];

export const loader = async ({ params, context }: Route.LoaderArgs) => {
  const store = getStoreFromContext(context);
  const post = await store
    .dispatch(postApis.endpoints.getPost.initiate({ id: params.id }))
    .unwrap();

  return { post, [HYDRATE_STATE_KEY]: store.getState() };
};

export const ErrorBoundary: FC<Route.ErrorBoundaryProps> = ({ params }) => {
  return <p>post id {params.id} not found!</p>;
};

const Component: FC<Route.ComponentProps> = ({ params }) => {
  const { data: post } = postApis.useGetPostQuery({ id: params.id });

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.body}</p>
    </div>
  );
};

export default Component;

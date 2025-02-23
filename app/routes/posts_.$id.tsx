import type { FC } from "react";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/posts_.$id";
import { getPost } from "~/api/getPost";

export const meta: Route.MetaFunction = ({ data, params: { id } }) => [
  {
    title: data?.post ? data?.post?.title || "---" : `Post not found`,
  },
  {
    name: "description",
    content: data?.post ? data?.post?.body || "---" : `Post ${id} not found`,
  },
];

export const links: Route.LinksFunction = () => [];

export const loader = async ({ params }: Route.LoaderArgs) => {
  const post = await getPost({ id: params.id });
  return { post };
};

export const ErrorBoundary: FC<Route.ErrorBoundaryProps> = ({ params }) => {
  return <p>post id {params.id} not found!</p>;
};

const Component: FC<Route.ComponentProps> = () => {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.body}</p>
    </div>
  );
};

export default Component;

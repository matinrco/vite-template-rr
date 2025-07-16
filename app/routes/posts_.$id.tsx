import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/posts_.$id";
import { withQueryClient, withHydration } from "~/query/config";
import type { GetPostRes } from "~/query/types";
import { getPostQueryOptions } from "~/query/getPost";

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

export const loader = withQueryClient<Route.LoaderArgs, { post: GetPostRes }>(
  async (queryClient, { params: { id } }) => {
    const post = await queryClient.ensureQueryData(getPostQueryOptions({ id }));
    return { post };
  },
);

export const ErrorBoundary: FC<Route.ErrorBoundaryProps> = ({ params }) => {
  return <p>post id {params.id} not found!</p>;
};

const Component = withHydration<Route.ComponentProps>(({ params: { id } }) => {
  const { data: post } = useQuery(getPostQueryOptions({ id }));

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.body}</p>
    </div>
  );
});

export default Component;

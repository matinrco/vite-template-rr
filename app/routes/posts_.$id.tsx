import { data } from "react-router";
import type { Route } from "./+types/posts_.$id";
import { wrapRouterFn, withHydration } from "~/rtk/store";
import { postApis } from "~/rtk/query/post";
import type { GetPostRes } from "~/rtk/query/post/types";

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

export const loader = wrapRouterFn<Route.LoaderArgs, { post: GetPostRes }>(
  async (store, { params }) => {
    try {
      const post = await store
        .dispatch(postApis.endpoints.getPost.initiate({ id: params.id }))
        .unwrap();
      return { post };
    } catch (error) {
      throw data("Post not found", { status: 404 });
    }
  },
);

export const ErrorBoundary = withHydration<Route.ErrorBoundaryProps>(
  ({ params }) => {
    return <p>post id {params.id} not found!</p>;
  },
);

const Component = withHydration<Route.ComponentProps>(({ params }) => {
  const { data: post } = postApis.useGetPostQuery({ id: params.id });

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.body}</p>
    </div>
  );
});

export default Component;

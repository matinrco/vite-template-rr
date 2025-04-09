import { Link, href } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/posts_._index";
import { withQueryClient, withHydration } from "~/query/config/queryClient";
import type { GetPostsRes } from "~/query/types";
import { getPostsQueryOptions } from "~/query/getPosts";

export const meta: Route.MetaFunction = ({ data }) => [
  {
    title: `Posts ${Array.isArray(data.posts) ? data.posts.length : 0} items`,
  },
  { name: "description", content: "list of published posts" },
];

export const links: Route.LinksFunction = () => [];

export const loader = withQueryClient<Route.LoaderArgs, { posts: GetPostsRes }>(
  async (queryClient) => {
    const posts = await queryClient.ensureQueryData(getPostsQueryOptions());

    return { posts };
  },
);

const Component = withHydration<Route.ComponentProps>(() => {
  const { data: posts } = useQuery(getPostsQueryOptions());

  return (
    <div>
      <h1>Posts ({Array.isArray(posts) ? posts.length : 0} items)</h1>
      {posts?.map((post, index) => (
        <Link
          key={index}
          to={href("/posts/:id", { id: (post?.id || 0).toString() })}
        >
          <div>
            <h2>{post?.title}</h2>
            <p>{post?.body}</p>
          </div>
        </Link>
      ))}
    </div>
  );
});

export default Component;

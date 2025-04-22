import { Link, data, href } from "react-router";
import type { Route } from "./+types/posts_._index";
import { wrapRouterFn, withHydration } from "~/rtk/store";
import type { GetPostsRes } from "~/rtk/query/post/types";
import { postApis } from "~/rtk/query/post";

export const meta: Route.MetaFunction = ({ data }) => [
  {
    title: `Posts ${Array.isArray(data.posts) ? data.posts.length : 0} items`,
  },
  { name: "description", content: "list of published posts" },
];

export const links: Route.LinksFunction = () => [];

export const loader = wrapRouterFn<Route.LoaderArgs, { posts: GetPostsRes }>(
  async (store) => {
    try {
      const posts = await store
        .dispatch(postApis.endpoints.getPosts.initiate())
        .unwrap();
      return { posts: Array.isArray(posts) ? posts : [] };
    } catch (error) {
      throw data("No posts found", { status: 404 });
    }
  },
);

const Component = withHydration<Route.ComponentProps>(() => {
  const { data: posts } = postApis.useGetPostsQuery();

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

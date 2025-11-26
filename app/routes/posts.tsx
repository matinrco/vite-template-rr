import type { FC } from "react";
import { Link, href } from "react-router";
import type { Route } from "./+types/posts";
import { getStoreFromContext } from "~/rtk/store";
import { postApis } from "~/rtk/query/post";
import { HYDRATE_STATE_KEY } from "~/rtk/constants";

export const meta: Route.MetaFunction = ({ loaderData }) => [
  {
    title: `Posts ${Array.isArray(loaderData?.posts) ? loaderData.posts.length : 0} items`,
  },
  { name: "description", content: "list of published posts" },
];

export const links: Route.LinksFunction = () => [];

export const loader = async ({ context }: Route.LoaderArgs) => {
  const store = getStoreFromContext(context);
  const posts = await store
    .dispatch(postApis.endpoints.getPosts.initiate())
    .unwrap();

  return { posts, [HYDRATE_STATE_KEY]: store.getState() };
};

const Component: FC<Route.ComponentProps> = () => {
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
};

export default Component;

import type { FC } from "react";
import { useLoaderData, Link, href } from "react-router";
import type { Route } from "./+types/posts_._index";
import { getPosts } from "~/api/getPosts";

export const meta: Route.MetaFunction = ({ data }) => [
  {
    title: `Posts ${Array.isArray(data.posts) ? data.posts.length : 0} items`,
  },
  { name: "description", content: "list of published posts" },
];

export const links: Route.LinksFunction = () => [];

export const loader = async () => {
  const posts = await getPosts();
  return { posts };
};

const Component: FC<Route.ComponentProps> = () => {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Posts ({Array.isArray(posts) ? posts.length : 0} items)</h1>
      {posts.map((post, index) => (
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

import { queryOptions } from "@tanstack/react-query";
import { axios } from "./config/axios";
import type { GetPostsReq, GetPostsRes } from "./types";

export const getPosts = async (req: GetPostsReq) => {
  const posts = await axios
    .get<GetPostsRes>(`posts`, {
      params: req,
    })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

  return posts;
};

export const getPostsQueryOptions = (req: GetPostsReq) =>
  queryOptions({
    queryKey: ["get-posts", req],
    queryFn: () => getPosts(req),
  });

import { axios } from "./config";
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

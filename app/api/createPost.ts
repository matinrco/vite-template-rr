import { type AxiosResponse, axios } from "./config";
import type { CreatePostsReq, CreatePostsRes } from "./types";

export const createPost = async (req: CreatePostsReq) => {
  const post = await axios
    .post<CreatePostsRes, AxiosResponse<CreatePostsRes>, CreatePostsReq>(
      "posts",
      req,
    )
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

  return post;
};

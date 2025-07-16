import { mutationOptions } from "@tanstack/react-query";
import { type AxiosResponse, axios } from "./config/axios";
import { getQueryClient } from "./config/client";
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

export const createPostMutationOptions = () =>
  mutationOptions({
    mutationKey: ["create-post"],
    mutationFn: createPost,
    onSuccess: () => {
      getQueryClient().invalidateQueries({ queryKey: ["get-posts"] });
      // you can call for each query you'd like to invalidate
      // getQueryClient().invalidateQueries({ queryKey: ['another-query'] })
    },
  });

import { axios } from "./config/axios";
import type { GetPostReq, GetPostRes } from "./types";

export class PostNotFoundError extends Error {}

export const getPost = async (req: GetPostReq) => {
  const posts = await axios
    .get<GetPostRes>(`posts/${req.id}`)
    .then((res) => res.data)
    .catch((error) => {
      if (error.status === 404) {
        throw new PostNotFoundError(`Post with id "${req.id}" not found!`);
      }
      throw error;
    });

  return posts;
};

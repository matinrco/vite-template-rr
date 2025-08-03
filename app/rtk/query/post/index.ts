import { api } from "~/rtk/query";
import type {
  CreatePostReq,
  CreatePostRes,
  GetPostsReq,
  GetPostsRes,
  GetPostReq,
  GetPostRes,
} from "./types";

export const postApis = api.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation<CreatePostRes, CreatePostReq>({
      query: (body) => ({
        url: "posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),
    getPosts: builder.query<GetPostsRes, GetPostsReq>({
      query: () => "posts",
      providesTags: ["Posts"],
    }),
    getPost: builder.query<GetPostRes, GetPostReq>({
      query: (req) => `posts/${req.id}`,
      providesTags: ["Post"],
    }),
  }),
  overrideExisting: false,
});

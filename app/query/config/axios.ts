import genericAxios, { type AxiosResponse } from "axios";
import { isServer } from "~/utils/environment";

export const axios = genericAxios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// add a request interceptor
axios.interceptors.request.use(
  async (config) => {
    // intercepted request is here

    // forward client headers to api when fetching in server side
    if (isServer) {
      const { getContextRequest } = await import("./asyncLocalStorage");
      const request = getContextRequest();

      if (request && "headers" in request) {
        request.headers.forEach((v, k) => {
          // only forward cookie and authorization header
          if (
            k.toLowerCase() === "cookie" ||
            k.toLowerCase() === "authorization"
          ) {
            config.headers.set(k, v);
          }
        });
      }
    }

    return config;
  },
  (error) => {
    // do something with request error

    return Promise.reject(error);
  },
);

// add a response interceptor
axios.interceptors.response.use(
  (response) => {
    // intercepted response is here
    // any status code that lie within the range of 2xx cause this function to trigger

    return response;
  },
  (error) => {
    // do something with response error
    // any status codes that falls outside the range of 2xx cause this function to trigger

    return Promise.reject(error);
  },
);

export type { AxiosResponse };

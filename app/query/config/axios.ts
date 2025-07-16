import genericAxios, { type AxiosResponse } from "axios";

export const axios = genericAxios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // intercepted request is here

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

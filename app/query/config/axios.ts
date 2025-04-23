import genericAxios, { type AxiosResponse } from "axios";

export const axios = genericAxios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axios.interceptors.request.use((config) => {
  // intercepted request is here

  return config;
});

axios.interceptors.response.use((response) => {
  // intercepted response is here

  return response;
});

export type { AxiosResponse };

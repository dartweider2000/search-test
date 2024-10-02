import { $fetch, type FetchOptions } from "ofetch";
import type { IApi } from "@/types";
import UsersApi from "@/api/modules/users.api";

const fetcherOptions: FetchOptions = {
  baseURL: import.meta.env.VITE_BASE_API_URL,
};

console.log(import.meta.env.VITE_BASE_API_URL);

const fetcher = $fetch.create(fetcherOptions);

const api: IApi = {
  users: new UsersApi(fetcher),
};

export default api;

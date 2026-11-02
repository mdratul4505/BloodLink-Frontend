import { ofetch } from "ofetch";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

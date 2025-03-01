import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create the API with a base query that handles the base URL and auth headers
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://rakib5001.binarybards.online/api/v1/",
    prepareHeaders: (headers) => {
      const token =
        localStorage.getItem("authenticationToken") ||
        sessionStorage.getItem("authenticationToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["product", "event"],
  endpoints: () => ({}),
});

export const imageUrl = "https://rakib5001.binarybards.online";

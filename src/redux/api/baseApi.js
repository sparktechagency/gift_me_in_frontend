import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create the API with a base query that handles the base URL and auth headers
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://174.138.48.210:5004/api/v1/",
    // baseUrl: "http://10.0.70.188:5004/api/v1/",
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
  tagTypes: ["product", "event", "package"],
  endpoints: () => ({}),
});

// export const imageUrl = "http://10.0.70.188:5004";
export const imageUrl = "http://174.138.48.210:5004";

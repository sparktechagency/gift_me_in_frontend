import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create the API with a base query that handles the base URL and auth headers
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://64.23.193.89:5000/api/v1/",
    // baseUrl: "http://10.0.70.188:5000/api/v1/",
    // baseUrl: "http://167.71.173.195:5004/api/v1/",
    // baseUrl: "http://10.0.70.30:5000/api/v1/",
    // baseUrl: "https://rakib5000.binarybards.online/api/v1/",
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
  tagTypes: ["product", "event", "package", "userProfile", "order"],
  endpoints: () => ({}),
});

export const imageUrl = "http://64.23.193.89:5000";
// export const imageUrl = "http://10.0.70.188:5000";
// export const imageUrl = "http://10.0.70.30:5000";
// export const imageUrl = "https://rakib5000.binarybards.online";

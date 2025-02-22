import { api } from "../api/baseApi";

const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => ({
        url: "/product",
        method: "GET",
      }),
      providesTags: ["product"],
    }),
  }),
});

export const { useGetAllProductsQuery } = productApi;

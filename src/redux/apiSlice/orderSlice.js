import { api } from "../api/baseApi";

const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => ({
        url: "/product-history",
        method: "GET",
      }),
      providesTags: ["order"],
    }),
  }),
});

export const { useGetAllOrdersQuery } = orderApi;

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

    getGiftSent: builder.query({
      query: () => ({
        url: "/gift-collection/all",
        method: "GET",
      }),
      providesTags: ["order"],
    }),

    //notifications for order
    getNotifications: builder.query({
      query: () => ({
        url: "/notification/all",
        method: "GET",
      }),
      providesTags: ["order"],
    }),

    updateNotification: builder.mutation({
      query: (id) => ({
        url: `/notification/update/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["order"],
    }),

    getAllProductsByCategory: builder.query({
      query: (category) => ({
        url: `/gift-collection/${category}`,
        method: "GET",
      }),
      providesTags: ["order"],
    }),

    overrideGift: builder.mutation({
      query: ({ id, data }) => ({
        url: `/gift-collection/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["order"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetGiftSentQuery,
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
  useGetAllProductsByCategoryQuery,
  useOverrideGiftMutation,
} = orderApi;

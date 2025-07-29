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

    addProduct: builder.mutation({
      query: (data) => ({
        url: "/product/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["product"],
    }),

    getSingleProduct: builder.query({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      providesTags: ["product"],
    }),

    markAsDelivered: builder.mutation({
      query: (data) => ({
        url: `/gift-collection/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/product/update/${id}`,
        method: "PATCH", // or "PATCH" if your API supports partial updates
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "product", id },
        { type: "product" }, // Also invalidate the full list
      ],
    }),

    uploadExcelProduct: builder.mutation({
      query: (data) => ({
        url: "/product/bulk-create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["product"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),

    getEventCategories: builder.query({
      query: () => ({
        url: "/event-category",
        method: "GET",
      }),
      providesTags: ["event", "order"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useAddProductMutation,
  useUploadExcelProductMutation,
  useDeleteProductMutation,
  useGetEventCategoriesQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useMarkAsDeliveredMutation,
} = productApi;

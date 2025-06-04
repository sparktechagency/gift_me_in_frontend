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
      providesTags: ["event"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useAddProductMutation,
  useUploadExcelProductMutation,
  useDeleteProductMutation,
  useGetEventCategoriesQuery,
} = productApi;

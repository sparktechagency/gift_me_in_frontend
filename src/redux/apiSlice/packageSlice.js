import { api } from "../api/baseApi";

const packageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    allPackages: builder.query({
      query: () => ({
        url: "/package",
        method: "GET",
      }),
      providesTags: ["package"],
    }),

    addPackage: builder.mutation({
      query: (data) => ({
        url: "/package/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["package"],
    }),

    editPackage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/package/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["package"],
    }),

    //budget

    getSubscribers: builder.query({
      query: (id) => ({
        url: `/payment`,
        method: "GET",
      }),
      providesTags: ["package"],
    }),

    updateBudget: builder.mutation({
      query: ({ id, data }) => ({
        url: `/payment/edit-price/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["package"],
    }),
  }),
});

export const {
  useAllPackagesQuery,
  useAddPackageMutation,
  useEditPackageMutation,

  //budget
  useGetSubscribersQuery,
  useUpdateBudgetMutation,
} = packageApi;

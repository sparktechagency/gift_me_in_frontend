import { api } from "../api/baseApi";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    allUsersData: builder.query({
      query: () => ({
        url: "/customer",
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `/customer/${data.get("id")}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/customer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useAllUsersDataQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

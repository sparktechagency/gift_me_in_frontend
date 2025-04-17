import { api } from "../api/baseApi";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    allUsersData: builder.query({
      query: () => ({
        url: "/customer",
        method: "GET",
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/customer/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useAllUsersDataQuery, useDeleteUserMutation } = userApi;

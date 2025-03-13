import { api } from "../api/baseApi";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    signUp: builder.mutation({
      query: (data) => ({
        url: "/user/register",
        method: "POST",
        body: data,
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    getUserProfile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ["userProfile"],
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "/user/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["userProfile"],
    }),

    getAllAdmin: builder.query({
      query: () => ({
        url: "/user/admins",
        method: "GET",
      }),
      providesTags: ["admin"],
    }),

    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/auth/create-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["admin"],
    }),

    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/auth/delete-admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useChangePasswordMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetAllAdminQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
} = authApi;

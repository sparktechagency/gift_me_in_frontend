import { api } from "../api/baseApi";

const eventApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (data) => ({
        url: "/event/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["event"],
    }),
    getEvents: builder.query({
      query: () => ({
        url: "/event",
        method: "GET",
      }),
      providesTags: ["event"],
    }),

    //subscribe

    getAllSubscribers: builder.query({
      query: () => ({
        url: "package/all-subscriptions",
        method: "GET",
      }),
      providesTags: ["subscriber"],
    }),
  }),
});

export const {
  useCreateEventMutation,
  useGetEventsQuery,
  useGetAllSubscribersQuery,
} = eventApi;

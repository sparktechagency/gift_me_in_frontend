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
  }),
});

export const { useCreateEventMutation, useGetEventsQuery } = eventApi;

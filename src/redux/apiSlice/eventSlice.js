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

    // survey

    getSurveyQuestionsById: builder.query({
      query: (id) => ({
        url: `survey/single/${id}`,
        method: "GET",
      }),
      providesTags: ["survey"],
    }),
  }),
});

export const {
  useCreateEventMutation,
  useGetEventsQuery,
  useGetAllSubscribersQuery,
  useGetSurveyQuestionsByIdQuery,
} = eventApi;

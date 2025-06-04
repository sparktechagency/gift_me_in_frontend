import { api } from "../api/baseApi";

const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGeneralStates: builder.query({
      query: () => ({
        url: `/payment/overview`,
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),

    revenueChartData: builder.query({
      query: (duration) => ({
        url: `/payment/revenue?type=${duration}`,
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),

    exportRevenueExcel: builder.mutation({
      query: (duration) => ({
        url: `/payment/export-revenue?type=${duration}`,
        method: "GET",
        responseHandler: async (response) => response.blob(), // handle blob manually
      }),
      providesTags: ["dashboard"],
    }),

    activeInactiveUsers: builder.query({
      query: () => ({
        url: `/payment/active-inactive-user`,
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
  }),
});

export const {
  useGetGeneralStatesQuery,
  useRevenueChartDataQuery,
  useExportRevenueExcelMutation,
  useActiveInactiveUsersQuery,
} = dashboardApi;

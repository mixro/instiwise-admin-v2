import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';


export const requestsApi = createApi({
  reducerPath: 'requestsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['DemoRequests', 'DemoRequest', 'DemoAnalytics'],

  endpoints: (builder) => ({
    // ADMIN: Get all demo/contact requests
    getAllDemoRequests: builder.query({
      query: (params) => ({
        url: '/demo-requests',
        params, // e.g. { page: 1, limit: 20, status: 'pending' }
      }),
      transformResponse: (res) => res.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'DemoRequest', id: _id })),
              { type: 'DemoRequests', id: 'LIST' },
            ]
          : [{ type: 'DemoRequests', id: 'LIST' }],
    }),

    // ADMIN: Get single request by ID
    getDemoRequestById: builder.query({
      query: (id) => `/demo-requests/${id}`,
      transformResponse: (res) => res.data,
      providesTags: (result, error, id) => [{ type: 'DemoRequest', id }],
    }),

    // ADMIN: Update request (e.g. mark as replied, add notes)
    updateDemoRequest: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/demo-requests/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'DemoRequest', id },
        { type: 'DemoRequests', id: 'LIST' },
        'DemoAnalytics',
      ],
    }),

    // ADMIN: Delete request
    deleteDemoRequest: builder.mutation({
      query: (id) => ({
        url: `/demo-requests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'DemoRequest', id },
        { type: 'DemoRequests', id: 'LIST' },
        'DemoAnalytics',
      ],
    }),

    // ADMIN: Get timely analytics (e.g. requests per day/week)
    getDemoRequestAnalytics: builder.query({
      query: () => '/demo-requests/analytics/timely',
      transformResponse: (res) => res.data || [],
      providesTags: ['DemoAnalytics'],
    }),
  }),
});

// Export hooks
export const {
  useGetAllDemoRequestsQuery,
  useGetDemoRequestByIdQuery,
  useGetDemoRequestAnalyticsQuery,

  useUpdateDemoRequestMutation,
  useDeleteDemoRequestMutation,
} = requestsApi;
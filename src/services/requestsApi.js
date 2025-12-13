// src/store/api/requestsApi.js
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
        params,
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

    // ADMIN: Get single request by ID — CACHE FIRST
    getDemoRequestById: builder.query({
      async queryFn(id, api, _extraOptions, baseQuery) {
        // Step 1: Check cache from getAllDemoRequests
        const listCache = api.getState().requestsApi.queries['getAllDemoRequests(undefined)'];
        // Note: If you use params (e.g. filters), you may need to check multiple keys
        // But for simple list, 'undefined' is safe

        if (listCache?.data) {
          const cachedRequest = listCache.data.find((req) => req._id === id);
          if (cachedRequest) {
            return { data: cachedRequest };
          }
        }

        // Step 2: Not in cache → fetch from server
        const result = await baseQuery(`/demo-requests/${id}`);

        if (result.error) {
          return { error: result.error };
        }

        return { data: result.data?.data || result.data };
      },
      providesTags: (result, error, id) => [{ type: 'DemoRequest', id }],
    }),

    // ADMIN: Update request
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

    // ADMIN: Analytics
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
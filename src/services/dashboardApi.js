import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Dashboard'],

    endpoints: (builder) => ({
        getDashboard: builder.query({
            query: () => '/dashboard',
            transformResponse: (response) => response.data || [],
            providesTags: ['Dashboard']
        }),
    })
});

// Export hooks
export const {
  useGetDashboardQuery,
} = dashboardApi;
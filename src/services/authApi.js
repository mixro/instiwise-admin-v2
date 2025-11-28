// src/store/api/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../constant/api';
import { logout, setCredentials } from '../store/slices/authSlice';


const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.currentUser?.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Auto-refresh logic (same as your RN version)
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = api.getState().auth.currentUser?.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newAccessToken = refreshResult.data?.data?.accessToken;
      const user = api.getState().auth.currentUser;

      const updatedUser = { ...user, accessToken: newAccessToken };
      api.dispatch(setCredentials(updatedUser));

      // Save to localStorage
      localStorage.setItem('instiwise-user', JSON.stringify(updatedUser));

      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/admin/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export { baseQueryWithReauth }
export const { useLoginMutation, useGetMeQuery, useLogoutMutation } = authApi;
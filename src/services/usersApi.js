// src/store/api/userApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Users', 'User', 'UserAnalytics'],

  endpoints: (builder) => ({
    // ADMIN: Get all users (pagination optional)
    getAllUsers: builder.query({
      query: (params) => ({
        url: '/users',
        params, // e.g. { page: 1, limit: 20, search: 'john' }
      }),
      transformResponse: (res) => res.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'User', id: _id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    // PUBLIC/ADMIN: Get user by ID (self or admin)
    getUserById: builder.query({
      queryFn: async (id, api, _extraOptions, baseQuery) => {
        // Step 1: Try to get from existing cache (getNews)
        const listResult = api.getState().usersApi.queries['getAllUsers(undefined)'];
        if (listResult?.data) {
          const cachedUsers = listResult.data.find((n) => n._id === id);
          if (cachedUsers) {
            return { data: cachedUsers };
          }
        }

        // Step 2: Not in cache → fetch from server
        const result = await baseQuery(`/users/${id}`);

        if (result.error) {
          return { error: result.error };
        }

        return { data: result.data?.data };
      },
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // ADMIN: Toggle admin status
    toggleAdmin: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/toggle-admin`,
        method: 'PATCH',
      }),
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        // Optimistically toggle isAdmin
        const patchList = dispatch(
          userApi.util.updateQueryData('getAllUsers', undefined, (draft) => {
            const user = draft.find((u) => u._id === userId);
            if (user) user.isAdmin = !user.isAdmin;
          })
        );

        const patchSingle = dispatch(
          userApi.util.updateQueryData('getUserById', userId, (draft) => {
            draft.isAdmin = !draft.isAdmin;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchList.undo();
          patchSingle.undo();
        }
      },
      invalidatesTags: (result, error, userId) => [
        { type: 'User', id: userId },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    // SELF/ADMIN: Update user profile
    updateUser: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    // SELF/ADMIN: Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    // ADMIN: Get timely user analytics (registrations, activity)
    getUserTimelyAnalytics: builder.query({
      query: () => '/users/stats/timely',
      transformResponse: (res) => res.data || [],
      providesTags: ['UserAnalytics'],
    }),
  }),
});

// Export all hooks
export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetUserTimelyAnalyticsQuery,

  useToggleAdminMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
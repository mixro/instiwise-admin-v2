// src/store/api/newsApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';

// Define NewsItem type (adjust as per your backend)
export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['News'],
  endpoints: (builder) => ({
    // GET: Fetch all news (admin sees all)
    getNews: builder.query({
      query: () => '/news',
      transformResponse: (response) => response.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'News', id: _id })),
              { type: 'News', id: 'LIST' },
            ]
          : [{ type: 'News', id: 'LIST' }],
    }),

    getNewsAnalytics: builder.query({
        query: () => '/news/analytics/timely',
        transformResponse: (response) => response.data || {},
        providesTags: ['NewsAnalytics'],
    }),

    // POST: Create new news (admin only)
    createNews: builder.mutation({
      query: (newsData) => ({
        url: '/news',
        method: 'POST',
        body: newsData,
      }),
      invalidatesTags: [{ type: 'News', id: 'LIST' }, 'NewsAnalytics'],
    }),

    // PUT: Update news
    updateNews: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/news/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'News', id }],
    }),

    // DELETE: Delete news
    deleteNews: builder.mutation({
      query: (id) => ({
        url: `/news/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'News', id },
        { type: 'News', id: 'LIST' },
        'NewsAnalytics'
      ],
    }),

    // PUT: Like news (optional for admin feedback)
    likeNews: builder.mutation({
      query: (newsId) => ({
        url: `/news/${newsId}/like`,
        method: 'PUT',
      }),
      async onQueryStarted(newsId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          newsApi.util.updateQueryData('getNews', undefined, (draft) => {
            const news = draft.find((n) => n._id === newsId);
            if (news) {
              news.likesCount = (news.likesCount || 0) + 1;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, newsId) => [{ type: 'News', id: newsId }],
    }),

    // PUT: Dislike news
    dislikeNews: builder.mutation({
      query: (newsId) => ({
        url: `/news/${newsId}/dislike`,
        method: 'PUT',
      }),
      async onQueryStarted(newsId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          newsApi.util.updateQueryData('getNews', undefined, (draft) => {
            const news = draft.find((n) => n._id === newsId);
            if (news) {
              news.dislikesCount = (news.dislikesCount || 0) + 1;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, newsId) => [{ type: 'News', id: newsId }],
    }),

    // PUT: Increment view count (useful for analytics)
    viewNews: builder.mutation({
      query: (newsId) => ({
        url: `/news/${newsId}/view`,
        method: 'PUT',
      }),
      async onQueryStarted(newsId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          newsApi.util.updateQueryData('getNews', undefined, (draft) => {
            const news = draft.find((n) => n._id === newsId);
            if (news) {
              news.viewsCount = (news.viewsCount || 0) + 1;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

// Export hooks
export const {
  useGetNewsQuery,
  useGetNewsAnalyticsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useLikeNewsMutation,
  useDislikeNewsMutation,
  useViewNewsMutation,
} = newsApi;
// src/store/api/projectsApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';

export const projectsApi = createApi({
  reducerPath: 'projectsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Projects', 'Project', 'UserProjects', 'ProjectAnalytics'],

  endpoints: (builder) => ({
    // GET: All projects (admin sees all)
    getAllProjects: builder.query({
      query: () => '/projects',
      transformResponse: (res) => res.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Project', id: _id })),
              { type: 'Projects', id: 'LIST' },
            ]
          : [{ type: 'Projects', id: 'LIST' }],
    }),

    // GET: Single project by ID
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      transformResponse: (res) => res.data,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),

    // GET: Projects by user (for user profile view)
    getUserProjects: builder.query({
      query: (userId) => `/projects/user/${userId}`,
      transformResponse: (res) => res.data || [],
      providesTags: (result, error, userId) => [
        { type: 'UserProjects', id: userId },
      ],
    }),

    // GET: Timely analytics (admin only)
    getProjectTimelyAnalytics: builder.query({
      query: () => '/projects/stats/timely',
      transformResponse: (res) => res.data || [],
      providesTags: ['ProjectAnalytics'],
    }),

    // POST: Create new project
    createProject: builder.mutation({
      query: (projectData) => ({
        url: '/projects',
        method: 'POST',
        body: projectData,
      }),
      invalidatesTags: [
        { type: 'Projects', id: 'LIST' },
        'ProjectAnalytics',
      ],
    }),

    // PUT: Update project (ownsProject middleware ensures only owner or admin)
    updateProject: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Project', id },
        { type: 'Projects', id: 'LIST' },
        'ProjectAnalytics',
      ],
    }),

    // DELETE: Delete project
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Project', id },
        { type: 'Projects', id: 'LIST' },
        'ProjectAnalytics',
      ],
    }),

    // PUT: Like a project (optimistic + count)
    likeProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}/like`,
        method: 'PUT',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistically increment like count
        const patchList = dispatch(
          projectsApi.util.updateQueryData('getAllProjects', undefined, (draft) => {
            const project = draft.find((p) => p._id === id);
            if (project) {
              project.likesCount = (project.likesCount || 0) + 1;
              project.isLiked = true;
            }
          })
        );

        const patchSingle = dispatch(
          projectsApi.util.updateQueryData('getProject', id, (draft) => {
            draft.likesCount = (draft.likesCount || 0) + 1;
            draft.isLiked = true;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchList.undo();
          patchSingle.undo();
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Project', id },
        'ProjectAnalytics', // likes affect analytics
      ],
    }),
  }),
});

// Export all hooks
export const {
  useGetAllProjectsQuery,
  useGetProjectQuery,
  useGetUserProjectsQuery,
  useGetProjectTimelyAnalyticsQuery,

  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useLikeProjectMutation,
} = projectsApi;
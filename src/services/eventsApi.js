// src/store/api/eventsApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Events', 'Event', 'UpcomingEvents'],

  endpoints: (builder) => ({
    // GET: All events (admin sees everything)
    getEvents: builder.query({
      query: () => '/events',
      transformResponse: (response) => response.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Event', id: _id })),
              { type: 'Events', id: 'LIST' },
            ]
          : [{ type: 'Events', id: 'LIST' }],
    }),

    // GET: Single event by ID
    getEventById: builder.query({
      queryFn: async (id, api, _extraOptions, baseQuery) => {
          // Step 1: Try to get from existing cache (getNews)
          const listResult = api.getState().eventsApi.queries['getEvents(undefined)'];
          if (listResult?.data) {
            const cachedEvents = listResult.data.find((n) => n._id === id);
            if (cachedEvents) {
              return { data: cachedEvents };
            }
          }

  
          // Step 2: Not in cache → fetch from server
          const result = await baseQuery(`/events/${id}/event`);
  
          if (result.error) {
            return { error: result.error };
          }
  
          return { data: result.data?.data };
      },
      providesTags: (result, error, id) => [{ type: 'Event', id }],
    }),

    getEventsAnalytics: builder.query({
        query: () => '/events/stats/timely',
        transformResponse: (response) => response.data || {},
        providesTags: ['EventsAnalytics'],
    }),

    // GET: Upcoming events (optional filtered list)
    getUpcomingEvents: builder.query({
      query: () => '/events/upcoming',
      transformResponse: (response) => response.data || [],
      providesTags: ['UpcomingEvents'],
    }),

    // POST: Create new event
    createEvent: builder.mutation({
      query: (eventData) => ({
        url: '/events',
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: [
        { type: 'Events', id: 'LIST' },
        'UpcomingEvents',
        'EventsAnalytics'
      ],
    }),

    // PUT: Update event
    updateEvent: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/events/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Event', id },
        { type: 'Events', id: 'LIST' },
        'UpcomingEvents',
        'EventsAnalytics'
      ],
    }),

    // DELETE: Delete event
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Events', id: 'LIST' },
        'UpcomingEvents',
        'EventsAnalytics'
      ],
    }),

    // PATCH: Toggle favorite (admin feedback or bookmarking)
    toggleFavorite: builder.mutation({
      query: (eventId) => ({
        url: `/events/${eventId}/favorite`,
        method: 'PATCH',
      }),
      async onQueryStarted(eventId, { dispatch, queryFulfilled }) {
        // Optimistically update all cached event lists
        const patchEvents = dispatch(
          eventsApi.util.updateQueryData('getEvents', undefined, (draft) => {
            const event = draft.find((e) => e._id === eventId);
            if (event) {
              event.isFavorited = !event.isFavorited;
              event.favoriteCount = event.isFavorited
                ? (event.favoriteCount || 0) + 1
                : Math.max(0, (event.favoriteCount || 0) - 1);
            }
          })
        );

        const patchUpcoming = dispatch(
          eventsApi.util.updateQueryData('getUpcomingEvents', undefined, (draft) => {
            const event = draft.find((e) => e._id === eventId);
            if (event) {
              event.isFavorited = !event.isFavorited;
              event.favoriteCount = event.isFavorited
                ? (event.favoriteCount || 0) + 1
                : Math.max(0, (event.favoriteCount || 0) - 1);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchEvents.undo();
          patchUpcoming.undo();
        }
      },
      invalidatesTags: (result, error, eventId) => [
        { type: 'Event', id: eventId },
        'UpcomingEvents',
        'EventsAnalytics'
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetEventsQuery,
  useGetEventsAnalyticsQuery,
  useGetEventByIdQuery,
  useGetUpcomingEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useToggleFavoriteMutation,
} = eventsApi;
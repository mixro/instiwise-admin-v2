// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';
import { newsApi } from '../services/newsApi';
import { eventsApi } from '../services/eventsApi';
import { projectsApi } from '../services/projectsApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      newsApi.middleware,
      eventsApi.middleware,
      projectsApi.middleware,
    ),
});
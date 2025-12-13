// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';
import { newsApi } from '../services/newsApi';
import { eventsApi } from '../services/eventsApi';
import { projectsApi } from '../services/projectsApi';
import { usersApi } from '../services/usersApi';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import { requestsApi } from '../services/requestsApi';
import { dashboardApi } from '../services/dashboardApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    [authApi.reducerPath]: authApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [requestsApi.reducerPath]: requestsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      newsApi.middleware,
      eventsApi.middleware,
      projectsApi.middleware,
      usersApi.middleware,
      requestsApi.middleware,
      dashboardApi.middleware,
    ),
});
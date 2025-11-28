// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';
import { newsApi } from '../services/newsApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      newsApi.middleware
    ),
});
// src/utils/persistAuth.js
import { setCredentials } from '../store/slices/authSlice';
import { store } from '../store/store';

export const loadPersistedAuth = () => {
  try {
    const saved = localStorage.getItem('instiwise-user');
    if (saved) {
      const user = JSON.parse(saved);
      store.dispatch(setCredentials(user));
    }
  } catch (err) {
    console.error('Failed to load auth from storage');
  }
};
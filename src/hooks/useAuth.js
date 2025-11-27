// src/hooks/useAuth.js
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, logout } from '../store/slices/authSlice';
import { useLogoutMutation } from '../services/authApi';

// localStorage helpers
const STORAGE_KEY = 'instiwise-user';

const saveAuth = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  } catch (err) {
    console.error('Failed to save auth data', err);
  }
};

const getAuth = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error('Failed to read auth data', err);
    return null;
  }
};

const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [logoutTrigger] = useLogoutMutation();

  // 1. Restore user from localStorage once on mount
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current || currentUser) return;

    const stored = getAuth();
    if (stored?.accessToken && stored?.refreshToken) {
      console.log('Admin session restored:', stored.email);
      dispatch(setCredentials(stored));
    }
    restoredRef.current = true;
  }, [dispatch, currentUser]);

  // 2. Logout function
  const signOut = async () => {
    try {
      if (currentUser?.refreshToken) {
        await logoutTrigger({ refreshToken: currentUser.refreshToken }).unwrap();
      }
    } catch (err) {
      console.warn('Logout API failed (offline?)', err);
    } finally {
      dispatch(logout());
      clearAuth();
      window.location.href = '/login'; // Full redirect to clear any stale state
    }
  };

  // 3. Derived values
  const isAuthenticated = !!currentUser?.accessToken && !!currentUser?.refreshToken;
  const isAdmin = currentUser?.isAdmin === true;
  const isLoading = !restoredRef.current && !currentUser; // Only loading during initial restore

  return {
    user: currentUser,
    isAuthenticated,
    isAdmin,
    isLoading,
    signOut,
  };
};
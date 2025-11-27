// src/hooks/useAuth.js
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetMeQuery, useLogoutMutation } from '../services/authApi';
import { setCredentials } from '../store/slices/authSlice';

// Helper: Save/load from localStorage (web equivalent of SecureStore)
const STORAGE_KEY = 'instiwise-user';

const saveAuth = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  } catch (err) {
    console.error('Failed to save auth to localStorage', err);
  }
};

const getAuth = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error('Failed to read auth from localStorage', err);
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

  // 1. Restore user from localStorage on first mount
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current || currentUser) return;

    const stored = getAuth();
    if (stored?.accessToken && stored?.refreshToken) {
      console.log('Auth restored from localStorage:', stored.email);
      dispatch(setCredentials(stored));
    }
    restoredRef.current = true;
  }, [dispatch, currentUser]);

  // 2. Fetch fresh user profile when token exists
  const {
    data: meData,
    isLoading: meLoading,
    error: meError,
    refetch: internalRefetch,
  } = useGetMeQuery(undefined, {
    skip: !currentUser?.accessToken,
  });

  // Track if /me query has ever been triggered
  const queryStartedRef = useRef(false);
  useEffect(() => {
    if (!meLoading && currentUser?.accessToken) {
      queryStartedRef.current = true;
    }
  }, [meLoading, currentUser?.accessToken]);

  // 3. Safe refetch function (for manual refresh in profile/settings)
  const refetchProfile = () => {
    if (queryStartedRef.current && typeof internalRefetch === 'function') {
      internalRefetch();
    } else {
      console.warn('refetchProfile called too early – will fetch on next valid token');
    }
  };

  // 4. One-time sync: Update local user with fresh server data (counts, awards, etc.)
  useEffect(() => {
    if (!meData?.user || !currentUser) return;

    const serverUser = meData.user;
    const updates = {};

    // Sync counts
    if (serverUser.projectsCount !== currentUser.projectsCount) {
      updates.projectsCount = serverUser.projectsCount;
    }
    if (serverUser.connectionsCount !== currentUser.connectionsCount) {
      updates.connectionsCount = serverUser.connectionsCount;
    }

    // Sync awards if different
    const currentAwards = currentUser.details?.awards || [];
    if (serverUser.awards && JSON.stringify(serverUser.awards) !== JSON.stringify(currentAwards)) {
      updates.details = {
        ...(currentUser.details || {}),
        awards: serverUser.awards,
      };
    }

    // Sync createdAt / updatedAt if missing
    if (!currentUser.details?.createdAt && serverUser.createdAt) {
      updates.createdAt = serverUser.createdAt
    }
    if (!currentUser.details?.updatedAt && serverUser.updatedAt) {
      updates.details = {
        ...(updates.details || currentUser.details || {}),
        updatedAt: serverUser.updatedAt,
      };
    }

    if (Object.keys(updates).length > 0) {
      const mergedUser = { ...currentUser, ...updates };
      dispatch(setCredentials(mergedUser));
      saveAuth(mergedUser);
      console.log('Profile synced with server');
    }
  }, [meData, currentUser, dispatch]);

  // 5. Logout function
  const signOut = async () => {
    try {
      if (currentUser?.refreshToken) {
        await logoutTrigger({ refreshToken: currentUser.refreshToken }).unwrap();
      }
    } catch (err) {
      console.warn('Logout API failed (possibly offline)', err);
    } finally {
      dispatch(logout());
      clearAuth();
      console.log('Logged out successfully');
    }
  };

  // 6. Derived values
  const isAuthenticated = !!currentUser?.accessToken && !!currentUser?.refreshToken;
  const isAdmin = currentUser?.isAdmin === true;
  const isLoading = meLoading || (!restoredRef.current && !currentUser);

  return {
    user: currentUser,
    isAuthenticated,
    isAdmin,
    isLoading,
    isError: !!meError,
    refetchProfile,
    signOut,
  };
};
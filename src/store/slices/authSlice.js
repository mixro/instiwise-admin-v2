import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null, // will hold user + tokens
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem('instiwise-user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
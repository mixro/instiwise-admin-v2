import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dashboard: {},
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboard: (state, action) => {
      state.dashboard= action.payload;
    },
  },
});

export const { setDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
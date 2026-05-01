import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  timeFramePresentWeekUsers: [],
  timeFramePastWeekUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    resetUser: (state) => {
      state.user = {};
    },
    setMenu: (state, action) => {
      state.menu = action.payload;
    },
    setTimeFramePresentWeekUsers: (state, { payload }) => {
      state.timeFramePresentWeekUsers = payload || []
    },
    setTimeFramePastWeekUsers: (state, { payload }) => {
      state.timeFramePastWeekUsers = payload || []
    },
  },
});

export const { setUser, resetUser, setMenu, setTimeFramePresentWeekUsers, setTimeFramePastWeekUsers } = userSlice.actions;

export default userSlice.reducer;

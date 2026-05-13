import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  timeFramePresentWeekUsers: [],
  timeFramePastWeekUsers: [],
  allUsers: [],
  adminAccessRequests: [],
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
    setAdminAccessRequests: (state, { payload }) => {
      state.adminAccessRequests = payload || []
    },
    setAllUsers: (state, { payload }) => {
      state.allUsers = payload || []
    },
  },
});

export const { setUser, resetUser, setMenu, setTimeFramePresentWeekUsers, setTimeFramePastWeekUsers, setAdminAccessRequests, setAllUsers } = userSlice.actions;

export default userSlice.reducer;

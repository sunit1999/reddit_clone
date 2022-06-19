import { createSlice } from "@reduxjs/toolkit";

const usersCommentSlice = createSlice({
  name: "usersCommentParams",
  initialState: {
    page: 1,
    limit: 2,
    sortBy: "createdAt",
  },
  reducers: {
    setUsersCommentPage: (state, { payload }) => {
      state.page = payload;
    },
    setUsersCommentLimit: (state, { payload }) => {
      state.limit = payload;
    },
    setUsersCommentSortBy: (state, { payload }) => {
      state.sortBy = payload;
    },
  },
});

export const usersCommentReducer = usersCommentSlice.reducer;

export const {
  setUsersCommentPage,
  setUsersCommentLimit,
  setUsersCommentSortBy,
} = usersCommentSlice.actions;

export const selectCurrentUsersCommentPage = (state) =>
  state.usersCommentParams.page;
export const selectCurrentUsersCommentLimit = (state) =>
  state.usersCommentParams.limit;
export const selectCurrentUsersCommentSortBy = (state) =>
  state.usersCommentParams.sortBy;
export const selectCurrentUsersCommentParams = (state) =>
  state.usersCommentParams;

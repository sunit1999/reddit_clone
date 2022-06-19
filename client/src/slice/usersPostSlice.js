import { createSlice } from "@reduxjs/toolkit";

const usersPostSlice = createSlice({
  name: "usersPostParams",
  initialState: {
    page: 1,
    limit: 2,
    sortBy: "createdAt",
  },
  reducers: {
    setUsersPostPage: (state, { payload }) => {
      state.page = payload;
    },
    setUsersPostLimit: (state, { payload }) => {
      state.limit = payload;
    },
    setUsersPostSortBy: (state, { payload }) => {
      state.sortBy = payload;
    },
  },
});

export const usersPostReducer = usersPostSlice.reducer;

export const { setUsersPostPage, setUsersPostLimit, setUsersPostSortBy } =
  usersPostSlice.actions;

export const selectCurrentUsersPostPage = (state) => state.usersPostParams.page;
export const selectCurrentUsersPostLimit = (state) =>
  state.usersPostParams.limit;
export const selectCurrentUsersPostSortBy = (state) =>
  state.usersPostParams.sortBy;
export const selectCurrentUsersPostParams = (state) => state.usersPostParams;
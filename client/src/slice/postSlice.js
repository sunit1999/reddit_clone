import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "postParams",
  initialState: {
    page: 1,
    limit: 2,
    sortBy: "createdAt",
    query: "",
  },
  reducers: {
    setFeedPage: (state, { payload }) => {
      state.page = payload;
    },
    setFeedLimit: (state, { payload }) => {
      state.limit = payload;
    },
    setFeedSortBy: (state, { payload }) => {
      state.sortBy = payload;
    },
    setFeedQuery: (state, { payload }) => {
      state.query = payload;
    },
  },
});

export const postReducer = postSlice.reducer;

export const { setFeedPage, setFeedLimit, setFeedSortBy, setFeedQuery } =
  postSlice.actions;

export const selectCurrentFeedPage = (state) => state.postParams.page;
export const selectCurrentFeedLimit = (state) => state.postParams.limit;
export const selectCurrentFeedSortBy = (state) => state.postParams.sortBy;
export const selectCurrentFeedQuery = (state) => state.postParams.query;
export const selectFeedParams = (state) => state.postParams;

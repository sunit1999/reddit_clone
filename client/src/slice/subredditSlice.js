import { createSlice } from "@reduxjs/toolkit";

const subredditSlice = createSlice({
  name: "subredditParams",
  initialState: {
    page: 1,
    limit: 2,
    sortBy: "createdAt",
    query: "",
  },
  reducers: {
    setSubsPage: (state, { payload }) => {
      state.page = payload;
    },
    setSubsLimit: (state, { payload }) => {
      state.limit = payload;
    },
    setSubsSortBy: (state, { payload }) => {
      state.sortBy = payload;
    },
    setSubsQuery: (state, { payload }) => {
      state.query = payload;
    },
  },
});

export const subredditReducer = subredditSlice.reducer;

export const { setSubsPage, setSubsLimit, setSubsSortBy, setSubsQuery } =
  subredditSlice.actions;

export const selectCurrentSubsPage = (state) => state.subredditParams.page;
export const selectCurrentSubsLimit = (state) => state.subredditParams.limit;
export const selectCurrentSubsSortBy = (state) => state.subredditParams.sortBy;
export const selectCurrentSubsQuery = (state) => state.subredditParams.query;
export const selectSubsFeedParams = (state) => state.subredditParams;

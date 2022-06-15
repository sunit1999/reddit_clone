import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "commentParams",
  initialState: {
    page: 1,
    limit: 2,
    sortBy: "createdAt",
    query: "",
  },
  reducers: {
    setCommentPage: (state, { payload }) => {
      state.page = payload;
    },
    setCommentLimit: (state, { payload }) => {
      state.limit = payload;
    },
    setCommentSortBy: (state, { payload }) => {
      state.sortBy = payload;
    },
    setCommentQuery: (state, { payload }) => {
      state.query = payload;
    },
  },
});

export const commentReducer = commentSlice.reducer;

export const {
  setCommentPage,
  setCommentLimit,
  setCommentSortBy,
  setCommentQuery,
} = commentSlice.actions;

export const selectCurrentCommentPage = (state) => state.commentParams.page;
export const selectCurrentCommentLimit = (state) => state.commentParams.limit;
export const selectCurrentCommentSortBy = (state) => state.commentParams.sortBy;
export const selectCurrentCommentQuery = (state) => state.commentParams.query;
export const selectCommentParams = (state) => state.commentParams;

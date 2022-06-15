import { createSlice } from "@reduxjs/toolkit";
import { constants } from "../utils/constants";

const authSlice = createSlice({
  name: "auth",
  initialState: JSON.parse(localStorage.getItem(constants.AUTH)) || {
    user: null,
    token: null,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
    },
  },
});

export const authReducer = authSlice.reducer;

export const { setCredentials } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;

import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../auth/authSlice";
import { commentReducer } from "../slice/commentSlice";
import { postReducer } from "../slice/postSlice";
import { subredditReducer } from "../slice/subredditSlice";
// import { counterReducer } from "../features/counter/counterSlice";
import { redditApi } from "./api";

export const store = configureStore({
  reducer: {
    // counter: counterReducer,
    // Add the generated reducer as a specific top-level slice
    [redditApi.reducerPath]: redditApi.reducer,
    auth: authReducer,
    postParams: postReducer,
    subredditParams: subredditReducer,
    commentParams: commentReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(redditApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
// setupListeners(store.dispatch);

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header/header";
import SubredditPage from "./pages/subreddit";
import CommentsPage from "./pages/comments";
import CreatePostPage from "./pages/createpost";
import CreateSubredditPage from "./pages/createsubreddit";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import NomatchPage from "./pages/nomatch";
import FeedPage from "./pages/feed";
import { PrivateRoute } from "./auth/privateRoute";
import SearchPage from "./pages/search";
import UserPage from "./pages/user";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route
            path="create/subreddit"
            element={
              <PrivateRoute>
                <CreateSubredditPage />
              </PrivateRoute>
            }
          />
          <Route
            path="create/post"
            element={
              <PrivateRoute>
                <CreatePostPage />
              </PrivateRoute>
            }
          />
          <Route path="r/:subredditId" element={<SubredditPage />} />
          <Route path="u/:userId" element={<UserPage />} />
          <Route
            path="r/:subredditId/comments/:postId"
            element={<CommentsPage />}
          />
          <Route path="search" element={<SearchPage />} />
          <Route index element={<FeedPage />} />
          <Route path="*" element={<NomatchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const redditApi = createApi({
  reducerPath: "redditApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Post", "User", "Comment", "Reply"],
  endpoints: (builder) => ({
    getPostById: builder.query({
      query: (id) => `posts/${id}`,
      providesTags: (result, error, arg) => [{ type: "Post", id: arg }],
    }),
    getAllPosts: builder.query({
      query: ({ page = 1, limit = 5, sortBy = "createdAt", query }) =>
        query
          ? `posts?page=${page}&limit=${limit}&sortBy=${sortBy}&query=${query}`
          : `posts?page=${page}&limit=${limit}&sortBy=${sortBy}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.posts.map(({ postId }) => ({
                type: "Post",
                id: postId,
              })),
              "Post",
            ]
          : ["Post"],
    }),
    getAllPostsInSubreddit: builder.query({
      query: ({
        subredditId,
        page = 1,
        limit = 5,
        sortBy = "createdAt",
        query = "",
      }) =>
        `subreddit/${subredditId}/posts?page=${page}&limit=${limit}&sortBy=${sortBy}&query=${query}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.posts.map(({ postId }) => ({
                type: "Post",
                id: postId,
              })),
              "Post",
            ]
          : ["Post"],
    }),
    getTopLevelComments: builder.query({
      query: ({
        postId,
        page = 1,
        limit = 5,
        sortBy = "createdAt",
        query = "",
      }) =>
        `comments/${postId}?page=${page}&limit=${limit}&sortBy=${sortBy}&query=${query}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.comments.map(({ commentId }) => ({
                type: "Comment",
                id: commentId,
              })),
              "Comment",
            ]
          : ["Comment"],
    }),
    getRepliesOnComments: builder.query({
      query: (parentCommentId) => `comments/replies/${parentCommentId}`,
      // providesTags: (result, error, arg) => [{ type: "Reply", id: arg }],
    }),
    getSubreddit: builder.query({
      query: (subredditId) => `subreddit/${subredditId}`,
      // providesTags: (result, error, arg) => [{ type: "Reply", id: arg }],
    }),
    getAllSubreddits: builder.query({
      query: ({ name, page = 1, limit = 5, sortBy = "totalMembers" }) => {
        return name
          ? `subreddit/?name=${name}&page=${page}&limit=${limit}&sortBy=${sortBy}`
          : `subreddit/?name&page=${page}&limit=${limit}&sortBy=${sortBy}`;
      },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: "auth/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    addComment: builder.mutation({
      query: (body) => ({
        url: "comments",
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const { postId, content, ...commentParams } = body;
        try {
          const { data } = await queryFulfilled;

          const patchComments = dispatch(
            redditApi.util.updateQueryData(
              "getTopLevelComments",
              { postId, ...commentParams },
              ({ comments }) => {
                comments.unshift(data);
              }
            )
          );

          const patchPost = dispatch(
            redditApi.util.updateQueryData("getPostById", postId, (draft) => {
              draft.post.totalComments++;
            })
          );
        } catch {
          console.log("some error occurred in addcomment updates");
        }
      },

      // invalidatesTags: (result, error, arg) => [
      //   { type: "Comment", id: arg.postId },
      //   { type: "Post", id: arg.postId },
      // ],
    }),
    addReply: builder.mutation({
      query: (body) => ({
        url: "comments",
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        // console.log(body);
        const { postId, parentCommentId, content, ...commentParams } = body;
        try {
          const { data } = await queryFulfilled;

          const patchComments = dispatch(
            redditApi.util.updateQueryData(
              "getTopLevelComments",
              { postId, ...commentParams },
              ({ comments }) => {
                // if (parentCommentId) return;
                const idx = comments.findIndex(
                  (comment) => comment.commentId === parentCommentId
                );
                console.log(body, idx);
                if (idx !== -1) comments[idx].totalReplies++;
              }
            )
          );

          // console.log(body);
          const patchReplies = dispatch(
            redditApi.util.updateQueryData(
              "getRepliesOnComments",
              parentCommentId,
              (draft) => {
                console.log(draft);
                draft.unshift(data);
              }
            )
          );

          const patchPost = dispatch(
            redditApi.util.updateQueryData("getPostById", postId, (draft) => {
              draft.post.totalComments++;
            })
          );
        } catch {
          console.log("some error occurred in addcomment updates");
        }
      },
      // invalidatesTags: (result, error, arg) => [
      //   { type: "Reply", id: arg.parentCommentId },
      //   { type: "Comment", id: arg.postId },
      //   { type: "Post", id: arg.postId },
      // ],
    }),
    addVoteOnPost: builder.mutation({
      query: (body) => ({
        url: "votes/post",
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const { postId, value, subredditId, ...postParams } = body;
        console.log(body, postParams);
        const patchPost = dispatch(
          redditApi.util.updateQueryData("getPostById", postId, (draft) => {
            draft.post.totalVotes += value - draft.post.hasVoted;
            draft.post.hasVoted = value;
          })
        );

        const patchAllPosts = dispatch(
          redditApi.util.updateQueryData(
            "getAllPosts",
            postParams,
            ({ posts }) => {
              if (subredditId) return;
              const idx = posts.findIndex((post) => post.postId === postId);
              posts[idx].totalVotes += value - posts[idx].hasVoted;
              posts[idx].hasVoted = value;
            }
          )
        );

        const patchAllSubredditPosts = dispatch(
          redditApi.util.updateQueryData(
            "getAllPostsInSubreddit",
            { subredditId, ...postParams },
            ({ posts }) => {
              if (!subredditId) return;
              const idx = posts.findIndex((post) => post.postId === postId);
              posts[idx].totalVotes += value - posts[idx].hasVoted;
              posts[idx].hasVoted = value;
            }
          )
        );

        try {
          await queryFulfilled;
          // console.log(patchPost);
        } catch {
          console.log("some error occurred in addvote updates");
          patchPost.undo();
          patchAllPosts.undo();
          patchAllSubredditPosts.undo();
        }
      },
    }),
    addVoteOnComment: builder.mutation({
      query: (body) => ({
        url: "votes/comment",
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const { commentId, value, postId, parentCommentId, ...commentParams } =
          body;

        // console.log(body);
        const patchComments = dispatch(
          redditApi.util.updateQueryData(
            "getTopLevelComments",
            { postId, ...commentParams },
            ({ comments }) => {
              if (parentCommentId) return;
              console.log(body);
              const idx = comments.findIndex(
                (comment) => comment.commentId === commentId
              );
              comments[idx].totalVotes += value - comments[idx].hasVoted;
              comments[idx].hasVoted = value;
            }
          )
        );

        const patchReplies = dispatch(
          redditApi.util.updateQueryData(
            "getRepliesOnComments",
            parentCommentId,
            (draft) => {
              if (!parentCommentId) return;
              const idx = draft.findIndex(
                (comment) => comment.commentId === commentId
              );
              console.log(idx);
              draft[idx].totalVotes += value - draft[idx].hasVoted;
              draft[idx].hasVoted = value;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          console.log("some error occurred in addvote in comments updates");
          patchComments.undo();
          patchReplies.undo();
        }
      },
    }),
    createSubreddit: builder.mutation({
      query: (body) => ({
        url: "subreddit",
        method: "POST",
        body,
      }),
    }),
    createPost: builder.mutation({
      query: (body) => ({
        url: "posts",
        method: "POST",
        body,
      }),
    }),
    editPost: builder.mutation({
      query: ({ postId, content }) => ({
        url: `posts/${postId}`,
        method: "PUT",
        body: {
          content,
        },
      }),
    }),
    editComment: builder.mutation({
      query: ({ commentId, content }) => ({
        url: `comments/${commentId}`,
        method: "PUT",
        body: {
          content,
        },
      }),
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg }],
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Comment", id: arg }],
    }),
    getUsersPosts: builder.query({
      query: ({ userId, page = 1, limit = 5, sortBy = "createdAt" }) =>
        `user/${userId}/posts?page=${page}&limit=${limit}&sortBy=${sortBy}`,
    }),
    getUsersComments: builder.query({
      query: ({ userId, page = 1, limit = 5, sortBy = "createdAt" }) =>
        `user/${userId}/comments?page=${page}&limit=${limit}&sortBy=${sortBy}`,
    }),
    getUserProfile: builder.query({
      query: (userId) => `user/${userId}`,
    }),
  }),
});

export const {
  useGetPostByIdQuery,
  useGetAllPostsQuery,
  useGetAllPostsInSubredditQuery,
  useGetTopLevelCommentsQuery,
  useGetRepliesOnCommentsQuery,
  useLazyGetRepliesOnCommentsQuery,
  useLoginMutation,
  useSignupMutation,
  useAddCommentMutation,
  useAddReplyMutation,
  useAddVoteOnPostMutation,
  useAddVoteOnCommentMutation,
  useCreateSubredditMutation,
  useGetSubredditQuery,
  useLazyGetAllSubredditsQuery,
  useGetAllSubredditsQuery,
  useCreatePostMutation,
  useEditPostMutation,
  useEditCommentMutation,
  useDeletePostMutation,
  useDeleteCommentMutation,
  useGetUsersPostsQuery,
  useGetUsersCommentsQuery,
  useGetUserProfileQuery,
} = redditApi;

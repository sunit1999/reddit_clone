import {
  Box,
  Card,
  Divider,
  Grid,
  Group,
  Loader,
  Pagination,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  useGetUserProfileQuery,
  useGetUsersCommentsQuery,
  useGetUsersPostsQuery,
} from "../app/api";
import Comment from "../components/Comment/comment";
import PostList from "../components/Post/postList";
import SortHeader from "../components/sortHeader/sortHeader";
import {
  selectCurrentUsersCommentParams,
  setUsersCommentPage,
  setUsersCommentSortBy,
} from "../slice/usersCommentSlice";
import {
  selectCurrentUsersPostParams,
  setUsersPostPage,
  setUsersPostSortBy,
} from "../slice/usersPostSlice";

const UserPage = () => {
  let { userId } = useParams();
  userId = parseInt(userId);

  const usersPostParams = useSelector(selectCurrentUsersPostParams);
  const usersCommentParams = useSelector(selectCurrentUsersCommentParams);
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useGetUsersPostsQuery({
    userId,
    ...usersPostParams,
  });

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetUserProfileQuery(userId);

  const {
    data: commentsData,
    isLoading: isCommetsLoading,
    isError: isCommentsError,
  } = useGetUsersCommentsQuery({
    userId,
    ...usersCommentParams,
  });

  return (
    <Box sx={{ maxWidth: 1080 }} mx={"auto"}>
      <Grid grow justify="center" align="flex-start">
        <Grid.Col span={8}>
          <Tabs>
            <Tabs.Tab label="Posts">
              {isLoading && <Loader size="sm" />}
              {isError && <div>Error...</div>}
              {data?.posts.length > 0 && (
                <Stack spacing="md">
                  <SortHeader
                    value={usersPostParams.sortBy}
                    setValue={(val) => {
                      dispatch(setUsersPostPage(1));
                      dispatch(setUsersPostSortBy(val));
                    }}
                  />
                  <PostList posts={data.posts} />
                  <Pagination
                    position="center"
                    boundaries={2}
                    page={usersPostParams.page}
                    onChange={(page) => dispatch(setUsersPostPage(page))}
                    total={Math.ceil(data.count / usersPostParams.limit)}
                  />
                </Stack>
              )}
            </Tabs.Tab>
            <Tabs.Tab label="Comments">
              {isCommetsLoading && <Loader size="sm" />}
              {isCommentsError && <div>Error...</div>}
              {commentsData?.comments.length > 0 && (
                <Stack>
                  <SortHeader
                    value={usersCommentParams.sortBy}
                    setValue={(val) => {
                      dispatch(setUsersCommentPage(1));
                      dispatch(setUsersCommentSortBy(val));
                    }}
                    label="Replies"
                  />

                  {commentsData?.comments.map((comment) => (
                    <Stack
                      spacing={0}
                      sx={(theme) => ({
                        border: "1px solid white",
                      })}
                    >
                      <Group p="xs" spacing={"xs"}>
                        <Text weight={"bold"}>
                          {comment.commenter.username}
                        </Text>
                        <Text>commented on</Text>
                        <Text
                          weight={"bold"}
                          component={Link}
                          to={`/r/${comment.Post.postId}/comments/${comment.Post.subredditId}`}
                          sx={() => ({
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          })}
                        >
                          {comment.Post.title}
                        </Text>
                      </Group>
                      <Comment key={comment.commentId} comment={comment} />
                    </Stack>
                  ))}
                  <Pagination
                    position="center"
                    boundaries={2}
                    page={usersCommentParams.page}
                    onChange={(page) => dispatch(setUsersCommentPage(page))}
                    total={Math.ceil(
                      commentsData?.count / usersCommentParams.limit
                    )}
                  />
                </Stack>
              )}
            </Tabs.Tab>
          </Tabs>
        </Grid.Col>
        <Grid.Col span={4}>
          {user && (
            <Card
              shadow="sm"
              p="lg"
              sx={(theme) => ({
                backgroundColor: theme.colors.dark[9],
              })}
            >
              <Title order={4}>
                {user.firstname} {user.lastname}
              </Title>
              <Text size="sm">u/{user.username}</Text>
              <Divider my="sm" />
              <Text size="sm">
                Joined {moment(user.createdAt).format("MMM DD, YYYY")}
              </Text>
            </Card>
          )}
          {isUserLoading && <Loader size="sm" />}
          {isUserError && <div>Some error...</div>}
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default UserPage;

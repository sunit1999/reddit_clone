import {
  Box,
  Card,
  Divider,
  Grid,
  Loader,
  Pagination,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useParams } from "react-router-dom";

import {
  useGetAllPostsInSubredditQuery,
  useGetSubredditQuery,
} from "../app/api";
import PostList from "../components/Post/postList";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSubsFeedParams,
  setSubsPage,
  setSubsSortBy,
} from "../slice/subredditSlice";
import SortHeader from "../components/sortHeader/sortHeader";
import moment from "moment";

const SubredditPage = () => {
  let { subredditId } = useParams();
  subredditId = parseInt(subredditId);
  const postParams = useSelector(selectSubsFeedParams);
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useGetAllPostsInSubredditQuery({
    subredditId,
    ...postParams,
  });

  const {
    data: subreddditInfo,
    isLoading: isSubsLoading,
    isError: isSubsError,
  } = useGetSubredditQuery(subredditId);

  return (
    <Box sx={{ maxWidth: 1080 }} mx={"auto"}>
      {subreddditInfo && (
        <Title order={3} py="md">
          r/{subreddditInfo.name}
        </Title>
      )}
      <Grid grow justify="center" align="flex-start">
        <Grid.Col span={8}>
          {isLoading && <Loader size="sm" />}
          {isError && <div>Error...</div>}
          {data?.posts.length > 0 && (
            <Stack spacing="md">
              <SortHeader
                value={postParams.sortBy}
                setValue={(val) => dispatch(setSubsSortBy(val))}
              />
              <PostList posts={data.posts} />
              <Pagination
                position="center"
                boundaries={2}
                page={postParams.page}
                onChange={(page) => dispatch(setSubsPage(page))}
                total={Math.ceil(data.count / postParams.limit)}
              />
            </Stack>
          )}
        </Grid.Col>
        <Grid.Col span={4}>
          {subreddditInfo && (
            <Card
              shadow="sm"
              p="lg"
              sx={(theme) => ({
                backgroundColor: theme.colors.dark[9],
              })}
            >
              <Text size="sm" color="dimmed">
                About Community
              </Text>
              <Space h="md" />
              <Text size="sm">{subreddditInfo.description}</Text>
              <Space h="sm" />
              <Title order={6}>{subreddditInfo.totalMembers} members</Title>
              <Divider my="sm" />
              <Text size="sm">
                Created{" "}
                {moment(subreddditInfo.createdAt).format("MMM DD, YYYY")}
              </Text>
            </Card>
          )}
          {isSubsLoading && <Loader size="sm" />}
          {isSubsError && <div>Some error...</div>}
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default SubredditPage;

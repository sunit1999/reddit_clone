import { Box, Grid, Loader, Pagination, Stack, Title } from "@mantine/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { useGetAllPostsQuery } from "../app/api";
import PostList from "../components/Post/postList";
import SortHeader from "../components/sortHeader/sortHeader";
import {
  selectFeedParams,
  setFeedPage,
  setFeedQuery,
  setFeedSortBy,
} from "../slice/postSlice";

const SearchPage = () => {
  const postParams = useSelector(selectFeedParams);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => dispatch(setFeedQuery(""));
  }, [dispatch]);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const { data, isLoading, isError } = useGetAllPostsQuery({
    ...postParams,
    query,
  });

  return (
    <Box sx={{ maxWidth: 1080 }} mx={"auto"}>
      <Title order={5} py="md">
        Search Results for "{query}"
      </Title>
      <Grid grow justify="center" align="flex-start">
        <Grid.Col span={8}>
          <Stack spacing="md" sx={{ maxWidth: 840 }} mx="auto">
            {isLoading && <Loader size="sm" />}
            {isError && <div>Error...</div>}
            {data?.posts.length > 0 && (
              <>
                <SortHeader
                  value={postParams.sortBy}
                  setValue={(val) => {
                    dispatch(setFeedPage(1));
                    dispatch(setFeedSortBy(val));
                  }}
                />
                <PostList posts={data.posts} />
                <Pagination
                  position="center"
                  boundaries={2}
                  page={postParams.page}
                  onChange={(page) => dispatch(setFeedPage(page))}
                  total={Math.ceil(data.count / postParams.limit)}
                />
              </>
            )}
          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          {/* <Card
            shadow="sm"
            p="lg"
            sx={(theme) => ({
              backgroundColor: theme.colors.dark[9],
            })}
          >
            <Text size="sm" color="dimmed">
              Top Communities
            </Text>
            <Space h="md" />
            {allSubs &&
              allSubs.map((subreddit) => (
                <>
                  <Group position="apart">
                    <Text
                      sx={(theme) => ({
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      })}
                      key={subreddit.subredditId}
                      component={Link}
                      to={`/r/${subreddit.subredditId}`}
                      weight={"500"}
                    >
                      r/{subreddit.name}
                    </Text>
                    <Text key={subreddit.subredditId}>
                      {subreddit.totalMembers}
                    </Text>
                  </Group>
                  <Divider my="sm" />
                </>
              ))}
            {isAllSubsLoading && <Loader size="sm" />}
            {isAllSubsError && <div>Some error...</div>}
          </Card> */}
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default SearchPage;

import { Box, Grid, Stack } from "@mantine/core";
import { useGetRepliesOnCommentsQuery } from "../../app/api";
import Comment from "./comment";

const NestedComments = ({ parentCommentId, setShowReplies }) => {
  const { data, isLoading, isError } =
    useGetRepliesOnCommentsQuery(parentCommentId);

  // console.log("replies", data);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Some Error occurred...</div>;

  if (!data) return null;

  return (
    <Grid columns={24}>
      <Grid.Col span={1}>
        <Box
          sx={(theme) => ({
            width: ".2rem",
            height: "100%",
            margin: "auto",
            backgroundColor: theme.colors.gray[7],
            "&:hover": {
              backgroundColor: theme.colors.gray[0],
              cursor: "pointer",
            },
          })}
          onClick={() => setShowReplies(false)}
        ></Box>
      </Grid.Col>
      <Grid.Col span={23}>
        <Stack>
          {data.map((comment) => (
            <Comment key={comment.commentId} comment={comment} />
          ))}
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default NestedComments;

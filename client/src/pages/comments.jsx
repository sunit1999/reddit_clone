import { Button, Loader, Stack } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";

import { useGetPostByIdQuery } from "../app/api";
import AddComment from "../components/Comment/addComment";
import CommentList from "../components/Comment/commentList";
import Post from "../components/Post/post";

const CommentsPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetPostByIdQuery(parseInt(postId));

  return (
    <Stack align="flex-start" sx={{ maxWidth: 840 }} mx="auto">
      <Button
        leftIcon={<IoChevronBack />}
        variant="outline"
        compact
        onClick={() => {
          window?.history?.state?.idx > 0
            ? navigate(-1)
            : navigate("/", { replace: true });
        }}
      >
        Back
      </Button>
      <Stack sx={{ width: "100%" }}>
        {isLoading && <Loader size="sm" />}
        {isError && <div>Error...</div>}
        {data && (
          <Stack>
            <Post post={data.post} />
            <AddComment postId={data.post?.postId} />
            <CommentList postId={data.post?.postId} />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default CommentsPage;

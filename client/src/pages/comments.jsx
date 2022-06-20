import { Button, Loader, Stack } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";

import { useGetPostByIdQuery, useGetTopLevelCommentsQuery } from "../app/api";
import AddComment from "../components/Comment/addComment";
import CommentList from "../components/Comment/commentList";
import Post from "../components/Post/post";
import { useSelector } from "react-redux";
import { selectCommentParams } from "../slice/commentSlice";

const CommentsPage = () => {
  let { postId } = useParams();
  postId = parseInt(postId);
  const navigate = useNavigate();
  const commentParams = useSelector(selectCommentParams);
  const { data, isLoading, isError } = useGetPostByIdQuery(parseInt(postId));
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useGetTopLevelCommentsQuery({
    postId,
    ...commentParams,
  });

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
          <>
            <Post post={data.post} />
            <AddComment postId={data.post?.postId} />
          </>
        )}

        {isCommentsLoading && <Loader size="sm" />}
        {isCommentsError && <div>Error...</div>}
        {commentsData?.comments.length > 0 && <CommentList data={commentsData} />}
      </Stack>
    </Stack>
  );
};

export default CommentsPage;

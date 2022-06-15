import { Loader, Pagination } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";

import { useGetTopLevelCommentsQuery } from "../../app/api";
import {
  selectCommentParams,
  setCommentPage,
  setCommentSortBy,
} from "../../slice/commentSlice";
import SortHeader from "../sortHeader/sortHeader";
import Comment from "./comment";

const CommentList = ({ postId }) => {
  const dispatch = useDispatch();
  const commentParams = useSelector(selectCommentParams);
  const { data, isLoading, isError } = useGetTopLevelCommentsQuery({
    postId,
    ...commentParams,
  });

  return (
    <>
      {isLoading && <Loader size="sm" />}
      {isError && <div>Error...</div>}
      {data?.comments.length > 0 && (
        <>
          <SortHeader
            value={commentParams.sortBy}
            setValue={(val) => dispatch(setCommentSortBy(val))}
            label="Replies"
          />

          {data.comments.map((comment) => (
            <Comment key={comment.commentId} comment={comment} />
          ))}
          <Pagination
            position="center"
            boundaries={2}
            page={commentParams.page}
            onChange={(page) => dispatch(setCommentPage(page))}
            total={Math.ceil(data.count / commentParams.limit)}
          />
        </>
      )}
    </>
  );
};

export default CommentList;

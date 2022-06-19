import { Pagination } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";

import {
  selectCommentParams,
  setCommentPage,
  setCommentSortBy,
} from "../../slice/commentSlice";
import SortHeader from "../sortHeader/sortHeader";
import Comment from "./comment";

const CommentList = ({ data }) => {
  const commentParams = useSelector(selectCommentParams);
  const dispatch = useDispatch();

  return (
    <>
      <SortHeader
        value={commentParams.sortBy}
        setValue={(val) => {
          dispatch(setCommentPage(1));
          dispatch(setCommentSortBy(val));
        }}
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
  );
};

export default CommentList;

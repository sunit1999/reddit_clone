import { useState } from "react";
import { Button, Divider, Group, Stack, Text, Tooltip } from "@mantine/core";
import RichTextEditor from "@mantine/rte";
import {
  BiUpvote,
  BiDownvote,
  BiMessage,
  BiEditAlt,
  BiCheck,
} from "react-icons/bi";
import { BsReply } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";

import moment from "moment";
import { Link } from "react-router-dom";

import {
  useAddVoteOnCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
} from "../../app/api";
import AddReply from "./addReply";
import NestedComments from "./nestedComment";
import { useSelector } from "react-redux";
import { selectCommentParams } from "../../slice/commentSlice";
import { useAuth } from "../../auth/useAuth";

const Comment = ({ comment }) => {
  const user = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const commentParams = useSelector(selectCommentParams);
  const [addVote] = useAddVoteOnCommentMutation();
  const [editComment] = useEditCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [content, setContent] = useState(comment.content);

  const {
    postId,
    commentId,
    parentCommentId,
    totalVotes,
    totalReplies,
    commenterId,
    commenter,
    createdAt,
  } = comment;
  const voteValue = comment.hasVoted || 0;

  const handleCommentSave = async () => {
    try {
      const result = await editComment({ commentId, content }).unwrap();
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
    setIsEditing((prev) => !prev);
  };

  const handleCommentDelete = async () => {
    try {
      const result = await deleteComment(commentId).unwrap();
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  const handleVoteClick = async (value) => {
    let newVoteValue = 0;
    if (value !== voteValue) {
      newVoteValue = value;
    }
    try {
      const result = await addVote({
        commentId,
        value: newVoteValue,
        postId,
        parentCommentId,
        ...commentParams,
      }).unwrap();
      // console.log("postvote", result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack>
      <Stack
        sx={(theme) => ({
          backgroundColor: theme.colors.dark[9],
        })}
        spacing={"0"}
        p={"lg"}
      >
        <Group position="apart">
          <Group spacing={"xs"}>
            <Text
              weight={"bold"}
              component={Link}
              to={`/u/${commenterId}`}
              sx={(theme) => ({
                "&:hover": {
                  textDecoration: "underline",
                },
              })}
            >
              u/{commenter.username}{" "}
            </Text>
            <Tooltip label={moment(createdAt).format("LLLL")}>
              <Text weight={"lighter"}>{moment(createdAt).fromNow()}</Text>
            </Tooltip>
          </Group>
          {commenterId === user?.userId && (
            <Group>
              {!isEditing && (
                <BiEditAlt
                  className="hover_class"
                  size={"1.2rem"}
                  onClick={() => setIsEditing((prev) => !prev)}
                />
              )}
              {isEditing && (
                <BiCheck
                  className="hover_class"
                  size={"1.5rem"}
                  onClick={handleCommentSave}
                />
              )}
              <RiDeleteBinLine
                className="hover_class"
                size={"1.2rem"}
                color="red"
                onClick={handleCommentDelete}
              />
            </Group>
          )}
        </Group>

        <RichTextEditor
          readOnly={!isEditing}
          value={content}
          sx={(theme) => ({
            backgroundColor: theme.colors.dark[9],
            fontSize: "1rem",
            border: "none",
          })}
          onChange={setContent}
          placeholder="What are yor thoughts?"
        />

        <Group
          sx={(theme) => ({
            color: theme.colors.gray[6],
          })}
          spacing="0.5rem"
        >
          <Button variant="subtle" color="gray" compact>
            <BiUpvote
              size={"1rem"}
              color={voteValue > 0 ? "#2edbe3" : "#fff"}
              onClick={() => handleVoteClick(1)}
            />
          </Button>
          <Text weight={"bold"} size="sm" color={"white"}>
            {totalVotes}
          </Text>
          <Button variant="subtle" color="gray" compact>
            <BiDownvote
              size={"1rem"}
              color={voteValue < 0 ? "#ff328b" : "#fff"}
              onClick={() => handleVoteClick(-1)}
            />
          </Button>
          {!showReplies && totalReplies > 0 && (
            <Button
              variant="subtle"
              color="gray"
              compact
              leftIcon={<BiMessage size={"1rem"} />}
              onClick={() => setShowReplies(true)}
            >
              <Text weight={"normal"} size="sm" color="gray">
                Show {totalReplies} Replies
              </Text>
            </Button>
          )}
          {showReplies && totalReplies > 0 && (
            <Button
              variant="subtle"
              color="gray"
              compact
              leftIcon={<BiMessage size={"1rem"} />}
              onClick={() => setShowReplies(false)}
            >
              <Text weight={"normal"} size="sm" color="gray">
                Hide {totalReplies} Replies
              </Text>
            </Button>
          )}

          <Button
            variant="subtle"
            color="gray"
            compact
            leftIcon={<BsReply size={"1rem"} />}
            onClick={() => setShowReplyBox((prev) => !prev)}
          >
            <Text weight={"normal"} size="sm" color="gray">
              Reply
            </Text>
          </Button>
        </Group>

        {showReplyBox && (
          <>
            <Divider my="sm" variant="dotted" />
            <AddReply
              postId={postId}
              parentCommentId={commentId}
              setShowReplyBox={setShowReplyBox}
            />
          </>
        )}
      </Stack>

      {showReplies && (
        <NestedComments
          parentCommentId={commentId}
          setShowReplies={setShowReplies}
        />
      )}
    </Stack>
  );
};

export default Comment;

import { Button, InputWrapper, Text } from "@mantine/core";
import RichTextEditor from "@mantine/rte";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAddReplyMutation } from "../../app/api";
import { useAuth } from "../../auth/useAuth";
import { selectCommentParams } from "../../slice/commentSlice";

const AddReply = ({ postId, parentCommentId, setShowReplyBox }) => {
  const user = useAuth();
  const [content, setContent] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const commentParams = useSelector(selectCommentParams);
  const [addComment, { isLoading }] = useAddReplyMutation();

  const handleAddReply = async () => {
    try {
      const reply = await addComment({
        postId,
        content,
        parentCommentId,
        ...commentParams,
      }).unwrap();

      setContent(null);
      setShowReplyBox(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {user ? (
        <>
          <InputWrapper label={`Reply as ${user.username}`}>
            <RichTextEditor
              value={content}
              onChange={(value, delta, source, editor) => {
                setContent(value);
                editor.getLength() > 1 ? setDisabled(false) : setDisabled(true);
              }}
              sx={(theme) => ({
                backgroundColor: theme.colors.dark[9],
                fontSize: "1rem",
                border: "none",
                maxHeight: "20rem",
                overflow: "auto",
              })}
              placeholder="What are your thoughts?"
            />
          </InputWrapper>
          <Button
            variant="filled"
            color="gray"
            disabled={disabled}
            loading={isLoading}
            onClick={handleAddReply}
          >
            Reply
          </Button>
        </>
      ) : (
        <Text>Log in or sign up to leave a comment</Text>
      )}
    </>
  );
};

export default AddReply;

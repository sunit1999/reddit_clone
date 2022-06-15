import { Button, Group, InputWrapper, Text } from "@mantine/core";
import RichTextEditor from "@mantine/rte";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAddCommentMutation } from "../../app/api";
import { useAuth } from "../../auth/useAuth";
import { selectCommentParams } from "../../slice/commentSlice";

const AddComment = ({ postId }) => {
  const user = useAuth();
  const [content, setContent] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const commentParams = useSelector(selectCommentParams);
  const [addComment, { isLoading }] = useAddCommentMutation();

  const handleAddComment = async () => {
    try {
      const result = await addComment({
        postId,
        content,
        ...commentParams,
      }).unwrap();
      // console.log("addcomment", result);
      setContent(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {user ? (
        <>
          <InputWrapper label={`Comment as ${user.username}`}>
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
            onClick={handleAddComment}
          >
            Comment
          </Button>
        </>
      ) : (
        <Group p={"md"} sx={(theme) => ({ backgroundColor: theme.colors.dark[9] })}>
          <Text>Log in or sign up to leave a comment</Text>
        </Group>
      )}
    </>
  );
};

export default AddComment;

import {
  Button,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import RichTextEditor from "@mantine/rte";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import {
  BiUpvote,
  BiDownvote,
  BiMessage,
  BiEditAlt,
  BiCheck,
} from "react-icons/bi";
import {
  useAddVoteOnPostMutation,
  useDeletePostMutation,
  useEditPostMutation,
} from "../../app/api";
import { useSelector } from "react-redux";
import { selectFeedParams } from "../../slice/postSlice";
import { selectSubsFeedParams } from "../../slice/subredditSlice";
import { useAuth } from "../../auth/useAuth";
import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";

const Post = ({ post }) => {
  const user = useAuth();
  const params = useParams();
  const feedParams = useSelector(selectFeedParams);
  const subredditParams = useSelector(selectSubsFeedParams);
  const [isEditing, setIsEditing] = useState(false);
  const [addVote] = useAddVoteOnPostMutation();
  const [editPost] = useEditPostMutation();
  const [deletePost] = useDeletePostMutation();
  const [content, setContent] = useState(post.content);

  const postParams = params.subredditId ? subredditParams : feedParams;
  const subId = params.subredditId ? parseInt(params.subredditId) : null;
  const voteValue = post.hasVoted || 0;

  const {
    postId,
    authorId,
    author,
    title,
    totalComments,
    totalVotes,
    subredditId,
    Subreddit,
    createdAt,
  } = post;

  const handlePostSave = async () => {
    try {
      const result = await editPost({ postId, content }).unwrap();
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
    setIsEditing((prev) => !prev);
  };

  const handlePostDelete = async () => {
    try {
      const result = await deletePost(postId).unwrap();
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVoteClick = async (value) => {
    let newVoteValue = 0;
    if (value !== voteValue) {
      newVoteValue = value;
    }
    try {
      const result = await addVote({
        postId,
        value: newVoteValue,
        subredditId: subId,
        ...postParams,
      }).unwrap();
      // console.log("postvote", result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid
      sx={(theme) => ({
        backgroundColor: theme.colors.dark[9],
        border: "1px solid #ffffff66",
        "&:hover": {
          border: "1px solid #ffffff",
        },
      })}
      py="sm"
      m={0}
    >
      <Grid.Col span={1}>
        <Stack align="center" justify="flex-start" spacing="xs">
          <Button
            variant="subtle"
            color="gray"
            compact
            onClick={() => handleVoteClick(1)}
          >
            <BiUpvote
              size={"1.5rem"}
              color={voteValue > 0 ? "#2edbe3" : "#fff"}
            />
          </Button>
          <Title order={5}>{totalVotes || 0}</Title>
          <Button variant="subtle" color="gray" compact>
            <BiDownvote
              size={"1.5rem"}
              color={voteValue < 0 ? "#ff328b" : "#fff"}
              onClick={() => handleVoteClick(-1)}
            />
          </Button>
        </Stack>
      </Grid.Col>

      <Grid.Col span={11}>
        <Stack>
          <Group position="apart">
            <Group spacing={"0.3rem"} position="left">
              <Text
                size="xs"
                weight={700}
                component={Link}
                to={`/r/${subredditId}`}
                sx={(theme) => ({
                  "&:hover": {
                    textDecoration: "underline",
                  },
                })}
              >
                r/{Subreddit.name}
              </Text>
              <Text size="xs">Posted by</Text>
              <Text
                size="xs"
                component={Link}
                to={`/u/${authorId}`}
                sx={(theme) => ({
                  "&:hover": {
                    textDecoration: "underline",
                  },
                })}
              >
                u/{author.username}{" "}
              </Text>
              <Tooltip label={moment(createdAt).format("LLLL")}>
                <Text size="xs">{moment(createdAt).fromNow()}</Text>
              </Tooltip>
            </Group>
            {authorId === user?.userId && (
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
                    onClick={handlePostSave}
                  />
                )}
                <RiDeleteBinLine
                  className="hover_class"
                  size={"1.2rem"}
                  color="red"
                  onClick={handlePostDelete}
                />
              </Group>
            )}
          </Group>

          <Text
            size="xl"
            weight={700}
            component={Link}
            to={`/r/${subredditId}/comments/${postId}`}
          >
            {title}
          </Text>

          <RichTextEditor
            readOnly={!isEditing}
            value={content}
            sx={(theme) => ({
              backgroundColor: theme.colors.dark[9],
              fontSize: "1rem",
              border: "none",
            })}
            onChange={setContent}
          />

          <Group
            spacing="5px"
            sx={(theme) => ({
              color: theme.colors.gray[6],
            })}
          >
            <Button
              variant="subtle"
              color="gray"
              compact
              leftIcon={<BiMessage size={"1rem"} />}
              component={Link}
              to={`/r/${subredditId}/comments/${postId}`}
            >
              <Text weight={"normal"} color="gray">
                {totalComments} Comments
              </Text>
            </Button>
          </Group>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default Post;

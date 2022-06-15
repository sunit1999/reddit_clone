import { useState } from "react";
import { RichTextEditor } from "@mantine/rte";
import {
  Button,
  Group,
  InputWrapper,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import {
  useCreatePostMutation,
  useLazyGetAllSubredditsQuery,
} from "../app/api";
import { BiSearch } from "react-icons/bi";
import { useForm } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

const CreatePostPage = () => {
  const navigate = useNavigate();

  const [subredditId, setSubredditId] = useState(null);
  const [data, setData] = useState([]);
  const postForm = useForm({
    initialValues: {
      title: "",
      content: "",
    },
  });
  const [getSubreddits] = useLazyGetAllSubredditsQuery();
  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleSearch = async (name) => {
    if (!name) {
      setData([]);
      return;
    }

    try {
      const subreddits = await getSubreddits({name}).unwrap();
      const newData = subreddits.map((sub) => ({
        value: sub.subredditId,
        label: sub.name,
      }));

      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (values) => {
    const body = { ...values, subredditId };
    try {
      const newPost = await createPost(body).unwrap();
      // console.log(newPost);
      navigate(`/r/${newPost.subredditId}/comments/${newPost.postId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={postForm.onSubmit(handleSubmit)}>
      <Stack
        sx={(theme) => ({
          maxWidth: 840,
          backgroundColor: theme.colors.dark[8],
        })}
        mx="auto"
        spacing={"md"}
        p={20}
      >
        <TextInput
          required
          label="Title"
          placeholder="Title of the post"
          {...postForm.getInputProps("title")}
        />

        <InputWrapper label="Content">
          <RichTextEditor
            sx={() => ({
              fontSize: "1rem",
              border: "none",
              maxHeight: "20rem",
              overflow: "auto",
            })}
            placeholder="What are your thoughts?"
            controls={[
              ["bold", "italic", "underline", "strike", "clean"],
              ["h1", "h2", "h3", "h4", "h5", "h6"],
              ["unorderedList", "orderedList"],
              ["link", "codeBlock", "blockquote"],
            ]}
            {...postForm.getInputProps("content")}
          />
        </InputWrapper>

        <Select
          required
          searchable
          clearable
          label="Subreddit"
          placeholder="Pick one subreddit"
          nothingFound="No such subreddit"
          icon={<BiSearch />}
          onSearchChange={handleSearch}
          // onDropdownClose={() => setData([])}
          data={data}
          onChange={(id) => setSubredditId(id)}
        />
        <Group position="right">
          <Button type="submit" loading={isLoading}>
            Create
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default CreatePostPage;

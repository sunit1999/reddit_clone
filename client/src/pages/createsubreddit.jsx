import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useCreateSubredditMutation } from "../app/api";

const CreateSubredditPage = () => {
  const navigate = useNavigate();
  const [createSub, { data, isLoading, isError }] =
    useCreateSubredditMutation();

  const subredditForm = useForm({
    initialValues: {
      name: "",
      description: "",
    },
  });

  const handleSubmit = async (values) => {
    try {
      const newSubreddit = await createSub(values).unwrap();
      // console.log(newSubreddit, data);
      navigate(`/r/${newSubreddit.subredditId}`);
    } catch ({ data }) {
      console.log(data);
      showNotification({
        title: "Error",
        message: data.error,
        color: "red",
      });
    }
  };

  return (
    <form onSubmit={subredditForm.onSubmit(handleSubmit)}>
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
          label="Name"
          placeholder="Title of the subreddit"
          {...subredditForm.getInputProps("name")}
        />
        <TextInput
          label="Description"
          placeholder="Short description of the subreddit"
          {...subredditForm.getInputProps("description")}
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

export default CreateSubredditPage;

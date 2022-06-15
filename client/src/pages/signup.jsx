import {
  Box,
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useLocation, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../app/api";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();

  const handleSignUp = async (values) => {
    try {
      const result = await signup(values).unwrap();
      showNotification({
        title: "Sign Up Success",
        message: "You can now login",
        color: "green",
      });
      navigate("/login", { replace: true });
    } catch (error) {
      console.log(error);
      const message = error?.data?.error || "Oops some error occured";
      showNotification({
        title: "Sign Up Error",
        message: message,
        color: "red",
      });
    }
  };

  const signUpForm = useForm({
    // schema: joiResolver(schema),
    initialValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
  });

  return (
    <Box
      sx={(theme) => ({ maxWidth: 440, backgroundColor: theme.colors.dark[8] })}
      mx="auto"
      p={20}
    >
      <form onSubmit={signUpForm.onSubmit(handleSignUp)}>
        <Stack>
          <TextInput
            required
            label="First Name"
            placeholder="Your First Name"
            {...signUpForm.getInputProps("firstname")}
          />

          <TextInput
            label="Last Name"
            placeholder="Your Last Name"
            {...signUpForm.getInputProps("lastname")}
          />

          <TextInput
            required
            label="Display Name"
            placeholder="Your Display Name"
            {...signUpForm.getInputProps("username")}
          />

          <TextInput
            required
            label="Email"
            placeholder="example@mail.com"
            {...signUpForm.getInputProps("email")}
          />

          <PasswordInput
            required
            placeholder="Password"
            label="Password"
            {...signUpForm.getInputProps("password")}
          />

          <PasswordInput
            required
            placeholder="Confirm Password"
            label="Confirm Password"
            {...signUpForm.getInputProps("confirmpassword")}
          />

          <Group position="right">
            <Button type="submit" loading={isLoading}>
              Sign Up
            </Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};

export default SignUpPage;

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
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { useLoginMutation } from "../app/api";
import { setCredentials } from "../auth/authSlice";
import { constants } from "../utils/constants";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (values) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials(result));
      localStorage.setItem(constants.AUTH, JSON.stringify(result));
      navigate(from, { replace: true });
    } catch ({ data }) {
      showNotification({
        title: "Authentication Error",
        message: data.error,
        color: "red",
      });
    }
  };

  const loginForm = useForm({
    // schema: joiResolver(schema),
    initialValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Box
      sx={(theme) => ({
        maxWidth: 440,
        backgroundColor: theme.colors.dark[8],
      })}
      mx="auto"
      p={20}
    >
      <form onSubmit={loginForm.onSubmit(handleLogin)}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="example@mail.com"
            {...loginForm.getInputProps("email")}
          />

          <PasswordInput
            required
            placeholder="Password"
            label="Password"
            {...loginForm.getInputProps("password")}
          />

          <Group position="right">
            <Button type="submit" loading={isLoading}>
              Login
            </Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginPage;

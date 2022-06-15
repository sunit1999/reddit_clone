import { Link, Outlet, useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Group, Menu, Text } from "@mantine/core";
import { useAuth } from "../../auth/useAuth";

import "./header.css";
import { constants } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../auth/authSlice";
import { BiPlus } from "react-icons/bi";
import { redditApi } from "../../app/api";

const Header = () => {
  const user = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setCredentials({ user: null, token: null }));
    localStorage.removeItem(constants.AUTH);
    dispatch(redditApi.util.resetApiState());
    navigate("/");
  };

  return (
    <>
      <Box
        className="app-header"
        mb={20}
        sx={(theme) => ({ background: theme.colors.dark[8] })}
      >
        <Text component={Link} to="/" className="app-logo">
          reddit
        </Text>
        <Group>
          {user && (
            <Button
              px={"sm"}
              variant="filled"
              leftIcon={<BiPlus size={"1rem"} />}
              component={Link}
              to="create/post"
            >
              New post
            </Button>
          )}
          {!user && (
            <>
              <Button variant="outline" component={Link} to="login">
                Login
              </Button>
              <Button component={Link} to="signup">
                Sign Up
              </Button>
            </>
          )}
          {user && (
            <>
              <Menu
                sx={(theme) => ({
                  "&:hover": {
                    cursor: "pointer",
                  },
                })}
                control={<Avatar radius="xl" />}
                trigger="click"
              >
                <Menu.Label>Hi {user.username}</Menu.Label>
                <Menu.Item component={Link} to="create/subreddit">
                  Create Subreddit
                </Menu.Item>
                <Menu.Item>My Profile</Menu.Item>
                <Menu.Item color="red" onClick={handleLogout}>
                  Logout
                </Menu.Item>
              </Menu>
            </>
          )}
        </Group>
      </Box>
      <Outlet />
    </>
  );
};

export default Header;

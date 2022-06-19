import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Group,
  Menu,
  Text,
  TextInput,
} from "@mantine/core";
import { useAuth } from "../../auth/useAuth";

import { constants } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../auth/authSlice";
import { BiPlus, BiSearch } from "react-icons/bi";
import { redditApi } from "../../app/api";
import { useState } from "react";
import { setFeedQuery } from "../../slice/postSlice";

const Header = () => {
  const user = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setCredentials({ user: null, token: null }));
    localStorage.removeItem(constants.AUTH);
    dispatch(redditApi.util.resetApiState());
    navigate("/");
  };

  const handleSearch = () => {
    dispatch(setFeedQuery(searchQuery));
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <>
      <Group
        position="apart"
        px={"1rem"}
        mb={20}
        sx={(theme) => ({ background: theme.colors.dark[8] })}
      >
        <Text
          sx={(theme) => ({
            fontSize: "2rem",
            fontWeight: "bolder",
          })}
          component={Link}
          to="/"
        >
          reddit
        </Text>
        <TextInput
          placeholder="Search Posts"
          value={searchQuery}
          icon={<BiSearch />}
          sx={() => ({
            maxWidth: "30rem",
            flexGrow: 1,
          })}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
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
                <Menu.Item component={Link} to={`/u/${user.userId}`}>My Profile</Menu.Item>
                <Menu.Item color="red" onClick={handleLogout}>
                  Logout
                </Menu.Item>
              </Menu>
            </>
          )}
        </Group>
      </Group>
      <Outlet />
    </>
  );
};

export default Header;

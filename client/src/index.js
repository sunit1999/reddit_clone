import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Global, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import { store } from "./app/store";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

function GlobalStyle() {
  return (
    <Global
      styles={(theme) => ({
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },

        body: {
          ...theme.fn.fontStyles(),
          margin: "0",
          minHeight: "100vh",
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
          lineHeight: theme.lineHeight,
        },
      })}
    />
  );
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider
        theme={{
          colorScheme: "dark",
          // fontFamily: "eurostile, sans-serif",
        }}
      >
        <NotificationsProvider>
          <GlobalStyle />
          <App />
        </NotificationsProvider>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

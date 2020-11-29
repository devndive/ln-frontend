import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";

import { ReactQueryDevtools } from "react-query-devtools";

import { App } from "./App";
import { AuthorizedApolloProvider } from "./AuthorizedApolloProvider";
import { AuthProvider } from "./AuthProvider";
import { UserProvider } from "./UserProvider";

import Amplify from "aws-amplify";

Amplify.configure({
  Auth: {
    region: "eu-central-1",
    userPoolId: "eu-central-1_txOTeKTCs",
    userPoolWebClientId: "c04drplrotvoads04rh6ci9ck",
  },
});

const isDevelopmentMode = process.env.NODE_ENV === 'development';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <AuthorizedApolloProvider>
          <App />
        </AuthorizedApolloProvider>
      </UserProvider>
    </AuthProvider>
    { isDevelopmentMode ? <ReactQueryDevtools initialIsOpen /> : null }
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

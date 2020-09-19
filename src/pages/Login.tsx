import React from "react";

import { gql, useMutation } from "@apollo/client";
import { useHistory, useLocation } from "react-router-dom";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const Login = ({ setIsAuthenticated }: { setIsAuthenticated: (state: boolean) => void }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  const [error, setError] = React.useState("");

  const [login] = useMutation(LOGIN_MUTATION);

  const history = useHistory();
  const location = useLocation<{ from: { pathname: string } }>();

  const { from } = location.state || { from: { pathname: "/links" } };
  const performLogin = () => {
    setIsLoading(true);
    login({ variables: { email, password } })
      .then((result) => {
        window.localStorage.setItem("token", result.data.login.token);
        setIsAuthenticated(true);
        setIsLoading(false);
        setError("");

        history.replace(from);
      })
      .catch((e) => {
        if (e && e.message) {
          setError(e.message);
        } else {
          setError("Unexpected error. Please try again");
        }

        setIsLoading(false);
      });
  };

  return (
    <div>
      <h1>Login</h1>

      <div className="mb-3 row">
        <label htmlFor="email" className="col-sm-2 col-form-label">
          Email
        </label>
        <div className="col-sm-10">
          <input
            id="email"
            type="text"
            name="email"
            value={email}
            className="form-control"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </div>
      </div>
      <div className="mb-3 row">
        <label htmlFor="password" className="col-sm-2 col-form-label">
          Password
        </label>
        <div className="col-sm-10">
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            className="form-control"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
      </div>

      {isLoading && <p>Loading ...</p>}
      {error && <p>Error: {error}</p>}

      <button
        className="btn btn-primary"
        name="loginButton"
        onClick={() => {
          performLogin();
        }}
      >
        Login
      </button>
    </div>
  );
};

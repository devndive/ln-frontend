import React from "react";

import "@reach/dialog/styles.css";
import "./index.scss";
import "./signin.scss";

import { ErrorMessage } from "./components";
import { useAuth } from "./AuthProvider";
import { Logger } from "./Logger";

export const UnauthenticatedApp = () => {
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState("none");

  const { signIn, isAuthenticated } = useAuth();

  Logger.log("isAuthenticated", isAuthenticated);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("none");

    // @ts-ignore
    const { email, password } = event.target.elements;

    signIn({
      email: email.value,
      password: password.value,
    });
  };

  const isError = status === "error";

  return (
      <main className="form-signin mt-5">
        <form onSubmit={handleLogin}>
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
          <label htmlFor="email" className="visually-hidden">
            Email
          </label>
          <input id="email" type="email" className="form-control" placeholder="Email address" />

          <label htmlFor="password" className="visually-hidden">
            Password
          </label>
          <input id="password" type="password" className="form-control" placeholder="Password" />

          {isError ? <ErrorMessage>{error}</ErrorMessage> : null}

          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Login
          </button>
        </form>
      </main>
  );
};

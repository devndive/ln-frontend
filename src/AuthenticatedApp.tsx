import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  RouteProps,
} from "react-router-dom";
import { Dialog } from "@reach/dialog";
import VisuallyHidden from "@reach/visually-hidden";

import "@reach/dialog/styles.css";
import "./index.scss";

import { Home } from "./pages/Home";
import { Links } from "./pages/Links";
import { CreateLink } from "./pages/LinkCreate";
import { EditLink } from "./pages/LinkEdit";

import { LinksByTag } from "./pages/LinksByTag";

import { ErrorMessage, FormGroup } from "./components";
import { useAuth } from "./AuthProvider";
import { Logger } from "./Logger";

export const AuthenticatedApp = () => {
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState("none");
  const [dialog, setDialog] = React.useState("none");

  const { signIn, isAuthenticated, logout, user } = useAuth();

  Logger.log("isAuthenticated", isAuthenticated);

  const loginWithPopup = () => {
    setDialog("login");
  };

  const close = () => {
    setDialog("none");
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("none");

    // @ts-ignore
    const { email, password } = event.target.elements;

    signIn({
      email: email.value,
      password: password.value,
    })
      .then((response: any) => {
        close();
      })
      .catch((response) => {
        Logger.error(response);
        setError(response.message);
        setStatus("error");
      });
  };

  const isError = status === "error";

  return (
    <Router>
      <Dialog isOpen={dialog === "login"} aria-label="Login form" onDismiss={close}>
        <button className="close-button" onClick={close}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>x</span>
        </button>

        <form onSubmit={handleLogin}>
          <FormGroup>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input id="email" type="text" className="form-control" />
          </FormGroup>

          <FormGroup>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input id="password" type="password" className="form-control" />
          </FormGroup>

          {isError ? <ErrorMessage>{error}</ErrorMessage> : null}

          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </form>
      </Dialog>

      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/links">
                  Links
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/links/create">
                  Add link
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
            </ul>

            <div className="d-flex">
              {isAuthenticated ? (
                <button className="btn btn-outline-light" onClick={() => logout()}>
                  Sign out
                </button>
              ) : (
                <button className="btn btn-outline-light" onClick={() => loginWithPopup()}>
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div id="main-content" className="container">
        <Switch>
          <Route path="/links/create">
            <CreateLink />
          </Route>
          <Route path="/links/:id/edit">
            <EditLink />
          </Route>
          <Route path="/links">
            <Links />
          </Route>
          <Route path="/tags/:tag">
            <LinksByTag />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

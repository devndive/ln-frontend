import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import "@reach/dialog/styles.css";
import "./index.scss";

import { Links } from "./pages/Links";
import { CreateLink } from "./pages/LinkCreate";
import { EditLink } from "./pages/LinkEdit";

import { LinksByTag } from "./pages/LinksByTag";

import { useAuth } from "./AuthProvider";
import { Logger } from "./Logger";

export const AuthenticatedApp = () => {
  const { isAuthenticated, logout } = useAuth();
  Logger.log("isAuthenticated", isAuthenticated);

  return (
    <Router>
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
              <button className="btn btn-outline-light" onClick={() => logout()}>
                Sign out
              </button>
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

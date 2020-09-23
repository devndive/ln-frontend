import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  RouteProps,
  useHistory,
} from "react-router-dom";
import { useApolloClient } from "@apollo/client";

import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Links } from "./pages/Links";
import { CreateLink } from "./pages/LinkCreate";
import { EditLink } from "./pages/LinkEdit";

import "./index.scss";

interface PrivateRouteProps {
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps & RouteProps> = ({
  children,
  isAuthenticated,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

const SignOutButton = ({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (state: boolean) => void;
}) => {
  const client = useApolloClient();
  const history = useHistory();

  const signOut = async () => {
    await client.clearStore();
    window.localStorage.removeItem("token");
    setIsAuthenticated(false);
    if (history) {
      history.push("/");
    }
  };

  return (
    <button className="btn btn-outline-light" onClick={signOut}>
      Sign out
    </button>
  );
};

export const App = () => {
  const token = () => {
    const t = window.localStorage.getItem("token");
    return t ? true : false;
  };

  const [isAuthenticated, setIsAuthenticated] = React.useState(token);

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
            <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
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
                <SignOutButton setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Link className="btn btn-outline-light" to="/login">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div id="main-content" className="container">
        <Switch>
          <Route path="/login">
            <Login setIsAuthenticated={setIsAuthenticated} />
          </Route>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/links/create">
            <CreateLink />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/links/:id/edit">
            <EditLink />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/links">
            <Links />
          </PrivateRoute>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

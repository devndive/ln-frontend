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
import { Dialog } from "@reach/dialog";
import VisuallyHidden from "@reach/visually-hidden";

import "@reach/dialog/styles.css";

import { Home } from "./pages/Home";
import { Links } from "./pages/Links";
import { CreateLink } from "./pages/LinkCreate";
import { EditLink } from "./pages/LinkEdit";

import "./index.scss";
import { LinksByTag } from "./pages/LinksByTag";

import Amplify, { Auth } from 'aws-amplify';
import { ErrorMessage, FormGroup } from "./components";

Amplify.configure({
  Auth: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_txOTeKTCs',
    userPoolWebClientId: 'c04drplrotvoads04rh6ci9ck'
  }
});

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

const getUser = async () => {
  const user = await Auth.currentAuthenticatedUser();

  return user;
}

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState("none");

  const [dialog, setDialog] = React.useState("none");

  const loginWithPopup = () => { 
    console.log("login got called");
    setDialog('login');
  }

  const logout = () => { 
    console.log("logout got called")
    Auth.signOut();
  }

  const close = () => { setDialog("none") }

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("none");

    // @ts-ignore
    const { email, password } = event.target.elements;

    Auth.signIn({
      username: email.value,
      password: password.value,
    }).then((response: any) => {
      close();
      setIsAuthenticated(true)
    }).catch((response) => {
      console.log(response);
      setError(response.message);
      setStatus("error");
      setIsAuthenticated(false);
    })
  }

  React.useEffect(() => {
    console.log("checking login state");

    getUser().then((user) => {
      console.log("user", user);

      if (!user) {
        return;
      }

      setIsAuthenticated(true);
    }).catch(data => {
      console.log("error checking login state", data);
     
      setIsAuthenticated(false);
    })
  }, [])

  const isError = status === 'error';

  return (
    <Router>
      <Dialog isOpen={dialog === 'login'} aria-label="Login form" onDismiss={close}>
        <button className="close-button" onClick={close}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>x</span>
        </button>

        <form onSubmit={handleLogin}>
          <FormGroup>
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" type="text" className="form-control" />
          </FormGroup>

          <FormGroup>
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" type="password" className="form-control" />
          </FormGroup>

          {isError ? <ErrorMessage>{error}</ErrorMessage> : null}

          <button className="btn btn-primary" type="submit">Login</button>
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
          <PrivateRoute isAuthenticated={isAuthenticated} path="/links/create">
            <CreateLink />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/links/:id/edit">
            <EditLink />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/links">
            <Links />
          </PrivateRoute>
          <PrivateRoute isAuthenticated={isAuthenticated} path="/tags/:tag">
            <LinksByTag />
          </PrivateRoute>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

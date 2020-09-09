import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  RouteProps,
  useLocation,
  useHistory,
  useParams,
} from "react-router-dom";
import { gql, useMutation, useQuery, useApolloClient } from "@apollo/client";
import ReactMarkdown from "react-markdown";
import toc from "remark-toc";

interface PrivateRouteProps {
  isAuthenticated: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps & RouteProps> = ({ children, isAuthenticated, ...rest }) => {
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

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const Login = ({ setIsAuthenticated }: { setIsAuthenticated: (state: boolean) => void }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  const [error, setError] = React.useState("");

  const [login] = useMutation(LOGIN_MUTATION);

  const history = useHistory();
  const location = useLocation<{ from: { pathname: string } }>();

  const { from } = location.state || { from: { pathname: "/" } };
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

      <input
        type="text"
        name="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      {isLoading && <p>Loading ...</p>}
      {error && <p>Error: {error}</p>}

      <button
        className="btn btn-primary"
        onClick={() => {
          performLogin();
        }}
      >
        Login
      </button>
    </div>
  );
};

const Home = () => {
  return <h1>Home</h1>;
};

const LINKS_QUERY = gql`
  query Links {
    links {
      id
      url
      description
      metadata {
        id
        title
        description
        image
        estimatedTimeToRead
      }
    }
  }
`;

const UPDATE_METADATA_MUTATION = gql`
  mutation UpdateMetadata($linkId: Int!) {
    updateMetadata(linkId: $linkId) {
      id
    }
  }
`;

const Links = () => {
  const [links, setLinks] = React.useState([]);

  const { error } = useQuery(LINKS_QUERY, {
    onCompleted: (data) => {
      setLinks(data.links);
    },
    onError: () => {
      console.log("Do some error handling");
    },
  });

  const [updateMetaDataMutation] = useMutation(UPDATE_METADATA_MUTATION);

  const updateMetadata = (linkId: number) => {
    updateMetaDataMutation({ variables: { linkId } })
      .then(() => { console.log("All good") })
      .catch((e) => { console.log("Error", e) });
  }

  const humanizeTime = (time: number): string => {
    if (time < 0.5) {
      return "less than a minute";
    }
    if (time >= 0.5 && time < 1.5) {
      return "1 minute";
    }

    return `${Math.ceil(time)} minutes`;
  };

  return (
    <div>
      <h1>Links</h1>

      {links.map(
        (
          link: {
            id: number;
            url: string;
            description: string;
            metadata: { title: string; description: string; image: string; estimatedTimeToRead: number };
          },
          idx) => {
          return (
            <div className="row" key={idx}>
              <div className="col-sm-4">
                {link.metadata ? <div className="card">
                  <img src={link.metadata.image} className="card-img-top" alt="Card for article" />
                  <div className="card-body">
                    <h5 className="card-title">{link.metadata.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{humanizeTime(link.metadata.estimatedTimeToRead)}</h6>
                    <p className="card-text">{link.metadata.description}</p>

                    <a href={link.url} target="_blank" rel="noreferrer" className="btn btn-primary">
                      Go read
                    </a>
                  </div>
                </div> : (<div>
                  <p>No metadata</p>
                  <button className="btn btn-primary" onClick={() => updateMetadata(link.id)}>Update metadata</button>
                  <a href={link.url} target="_blank" rel="noreferrer">Check URL</a>
                </div>)
                }
              </div>
              <div className="col-sm-8">
                <p>
                  Notes: <Link to={`/links/${link.id}/edit`}>edit</Link> <br />
                  <ReactMarkdown
                    className="result"
                    source={link.description}
                    skipHtml={false}
                    escapeHtml={false}
                    // renderers={{code: CodeBlock}}
                    plugins={[toc]}
                  />
                </p>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

const LINK_QUERY = gql`
  query Link($id: Int!) {
    link(id: $id) {
      id
      url
      description
    }
  }
`;

const UPDATE_LINK = gql`
  mutation UpdateLink($id: Int!, $url: String!, $description: String!) {
    updateLink(id: $id, url: $url, description: $description) {
      id
      url
      description
    }
  }
`;

const EditLink = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(LINK_QUERY, { variables: { id: Number.parseInt(id) } });

  const [updateLink] = useMutation(UPDATE_LINK);

  const [url, setUrl] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const history = useHistory();

  useEffect(() => {
    if (data && data.link) {
      setUrl(data.link.url);
      setNotes(data.link.description);
    }
  }, [data]);

  const saveChanges = () => {
    updateLink({ variables: { id: Number.parseInt(id), url: url, description: notes } }).then(() => {
      history.replace("/links");
    });
  };

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error ...</p>;

  return (
    <>
      <div className="mb-3">
        <label htmlFor="url" className="form-label">
          Url
        </label>
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          name="url"
          id="form"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <div className="row">
          <div className="col">
            <label htmlFor="url" className="form-label">
              Notes
        </label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              name="notes"
              id="notes"
              className="form-control"
              rows={5}
            ></textarea>

          </div>
          <div className="col">
            <label className="form-label">
              &nbsp;
        </label>
            <ReactMarkdown
              className="result"
              source={notes}
              skipHtml={false}
              escapeHtml={false}
              // renderers={{code: CodeBlock}}
              plugins={[toc]}
            />

          </div>
        </div>
      </div>


      <button type="submit" className="btn btn-primary" onClick={() => saveChanges()}>
        Save changes
      </button>
    </>
  );
};

const CREATE_LINK = gql`
  mutation CreateLink($url: String!, $description: String!) {
    createLink(url: $url, description: $description) {
      id
    }
  }
`;

const CreateLink = () => {
  const [createLinkMutation] = useMutation(CREATE_LINK);

  const [url, setUrl] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const history = useHistory();

  const createLink = () => {
    createLinkMutation({ variables: { url: url, description: notes } }).then(() => {
      history.replace("/links");
    });
  };


  return (
    <>
      <div className="mb-3">
        <label htmlFor="url" className="form-label">
          Url
        </label>
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          name="url"
          id="form"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <div className="row">
          <div className="col">
            <label htmlFor="url" className="form-label">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              name="notes"
              id="notes"
              className="form-control"
              rows={5}
            ></textarea>

          </div>
          <div className="col">
            <label className="form-label">
              &nbsp;
            </label>
            <ReactMarkdown
              className="result"
              source={notes}
              skipHtml={false}
              escapeHtml={false}
              // renderers={{code: CodeBlock}}
              plugins={[toc]}
            />

          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" onClick={() => createLink()}>
        Save
      </button>
    </>
  );
};

const SignOutButton = ({ setIsAuthenticated }: { setIsAuthenticated: (state: boolean) => void }) => {
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
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
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

        <div className="container">
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
      </div>
    </Router>
  );
};

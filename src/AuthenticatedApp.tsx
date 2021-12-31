import {
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";

import "./index.scss";

import { Links } from "./pages/Links";
import { CreateLink } from "./pages/LinkCreate";
import { EditLink } from "./pages/LinkEdit";

import { LinksByTag } from "./pages/LinksByTag";

import { useAuth } from "./AuthProvider";

export const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Links />} />
        <Route path="links" element={<Links />} />
        <Route path="links/create" element={<CreateLink />} />
        <Route path="links/:id/edit" element={<EditLink />} />
        <Route path="tags/:tag" element={<LinksByTag />} />
      </Route>
    </Routes>
  );
};

const Layout = () => {
  const { logout } = useAuth();

  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-lg-0">
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
        <Outlet />
      </div>
    </>
  );
};

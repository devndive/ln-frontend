import "./index.scss";

import { useAuth } from "./AuthProvider";
import { Logger } from "./Logger";

import { AuthenticatedApp } from "./AuthenticatedApp";
import { UnauthenticatedApp } from "./UnauthenticatedApp";

export const App = () => {
  const { isAuthenticated } = useAuth();
  Logger.log("isAuthenticated", isAuthenticated);

  if (isAuthenticated) {
    return <AuthenticatedApp />;
  }

  return <UnauthenticatedApp />;
};

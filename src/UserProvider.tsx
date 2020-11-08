import React from "react";
import { useAuth } from "./AuthProvider";

const UserContext = React.createContext({});

const UserProvider: React.FC = (props) => {
  const { user } = useAuth();

  return <UserContext.Provider value={{ user }} {...props} />;
};

const useUser = () => React.useContext(UserContext);

export { UserProvider, useUser };

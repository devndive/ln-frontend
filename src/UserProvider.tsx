import React from "react";
import { useAuth } from "./AuthProvider";

const UserContext = React.createContext({});

type UserProviderProps = {
  children?: React.ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = (props) => {
  const { user } = useAuth();

  return <UserContext.Provider value={{ user }} {...props} />;
};

const useUser = () => React.useContext(UserContext);

export { UserProvider, useUser };

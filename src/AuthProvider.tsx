import React from "react";
import Amplify, { Auth } from "aws-amplify";
import { UseMutateFunction, useMutation, useQuery } from "react-query";
import { Logger } from "./Logger";

Amplify.configure({
  Auth: {
    region: "eu-central-1",
    userPoolId: "eu-central-1_txOTeKTCs",
    userPoolWebClientId: "c04drplrotvoads04rh6ci9ck",
  },
});

interface User {
  email: string;
  userId: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegistrationData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  signIn: UseMutateFunction<User, any, LoginData, unknown>;
  register: (data: RegistrationData) => Promise<any>;
  logout: () => void;
}

// @ts-ignore
const AuthContext = React.createContext<AuthContextType>();

const AuthProvider: React.FC = (props) => {
  const [user, setUser] = React.useState<User>({ email: "", userId: "" });
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const { mutate: signIn } = useMutation<User, any, LoginData>(({ email, password }) =>
    Auth.signIn({ username: email, password }).then((user) => {
      setIsAuthenticated(true);
      return Promise.resolve({ email: user.attributes.email, userId: user.attributes.sub });
    })
  );

  const { isLoading, error, data } = useQuery("currentAuthenticatedUser", () =>
    Auth.currentAuthenticatedUser()
  );

  const register = ({ email, password }: RegistrationData): Promise<any> => {
    return Auth.signUp({ username: email, password });
  };

  const logout = (): void => {
    setIsAuthenticated(false);
    Auth.signOut();
    window.location.assign(window.location.toString());
  };

  React.useEffect(() => {
    if (data) {
      Logger.log("AuthProvider::useEffect with data", data);

      setIsAuthenticated(true);
      setUser(data);
    }

  }, [data]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, signIn, logout, register }} {...props} />;
};

const useAuth = () => React.useContext<AuthContextType>(AuthContext);

export { AuthProvider, useAuth };

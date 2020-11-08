import React from "react";
import Amplify, { Auth } from "aws-amplify";
import { useQuery } from "react-query";

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
  login: (data: LoginData) => Promise<any>;
  register: (data: RegistrationData) => Promise<any>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType>({
  user: { email: "", userId: "" },
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => {},
});

const AuthProvider: React.FC = (props) => {
  const [user, setUser] = React.useState<User>({ email: "", userId: "" });

  const { isLoading, error, data } = useQuery("currentAuthenticatedUser", () =>
    Auth.currentAuthenticatedUser()
  );

  const login = ({ email, password }: LoginData): Promise<any> => {
    return Auth.signIn({ username: email, password }).then((user) =>
      setUser({ email: user.attributes.email, userId: user.attributes.sub })
    );
  };

  const register = ({ email, password }: RegistrationData): Promise<any> => {
    return Auth.signUp({ username: email, password });
  };

  const logout = (): void => {
    Auth.signOut();
    window.location.assign(window.location.toString());
  };

  React.useEffect(() => {
    setUser(data);
  }, [data]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (error) {
    console.log(error);
    return <div>Something really bad happened</div>;
  }

  return <AuthContext.Provider value={{ user, login, logout, register }} {...props} />;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };

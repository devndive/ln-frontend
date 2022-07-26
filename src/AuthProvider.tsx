import React from "react";
import { UseMutateFunction, useMutation, useQuery } from "@tanstack/react-query";
import Auth from '@aws-amplify/auth';

Auth.configure({
  region: "eu-central-1",
  userPoolId: "eu-central-1_txOTeKTCs",
  userPoolWebClientId: "c04drplrotvoads04rh6ci9ck",
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

interface RegistrationConfirmationData {
  email: string;
  code: string;
}

interface ForgotPasswordData {
  username: string;
}

interface ForgotPasswordSubmitData {
  username: string;
  code: string;
  newPassword: string;
}

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  signIn: UseMutateFunction<User, any, LoginData, unknown>;
  register: (data: RegistrationData) => Promise<any>;
  confirmRegistration: (data: RegistrationConfirmationData) => Promise<any>;
  forgotPassword: (data: ForgotPasswordData) => Promise<any>;
  forgotPasswordSubmit: (data: ForgotPasswordSubmitData) => Promise<any>;
  logout: () => void;
}

// @ts-ignore
const AuthContext = React.createContext<AuthContextType>();

type AuthProviderProps = {
  children?: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = (props) => {
  const [user, setUser] = React.useState<User>({ email: "", userId: "" });
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const { mutate: signIn } = useMutation<User, any, LoginData>(({ email, password }) =>
    Auth.signIn({ username: email, password }).then((user) => {
      setIsAuthenticated(true);
      return Promise.resolve({ email: user.attributes.email, userId: user.attributes.sub });
    })
  );

  const { isLoading, error, data } = useQuery(["currentAuthenticatedUser"], () =>
    Auth.currentAuthenticatedUser()
  );

  const register = ({ email, password }: RegistrationData): Promise<any> => {
    return Auth.signUp({ username: email, password });
  };

  const confirmRegistration = ({ email, code }: RegistrationConfirmationData): Promise<any> => {
    return Auth.confirmSignUp(email, code);
  }

  const forgotPassword = ({ username }: ForgotPasswordData): Promise<any> => {
    return Auth.forgotPassword(username);
  }

  const forgotPasswordSubmit = ({ username, code, newPassword }: ForgotPasswordSubmitData): Promise<any> => {
    return Auth.forgotPasswordSubmit(username, code, newPassword);
  }

  const logout = (): void => {
    setIsAuthenticated(false);
    Auth.signOut();
    window.location.assign(window.location.toString());
  };

  React.useEffect(() => {
    if (data) {
      setIsAuthenticated(true);
      setUser(data);
    }

  }, [data]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, signIn, logout, register, confirmRegistration, forgotPassword, forgotPasswordSubmit }} {...props} />;
};

const useAuth = () => React.useContext<AuthContextType>(AuthContext);

export { AuthProvider, useAuth };

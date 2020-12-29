import React from "react";
import { ErrorMessage } from ".";

export interface RegistrationFormData {
  username: string;
  password: string;
}

interface RegistrationFormProps {
  handleRegistration: (data: RegistrationFormData) => void;
  error: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  handleRegistration,
  error,
}) => {
  const [errorState, setErrorState] = React.useState(error ?? "");

  const internalHandleRegistration = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // @ts-ignore
    const { email, password } = event.target.elements;

    if (!email.value || !password.value) {
      setErrorState("Email and password are required!");
      return;
    } else {
      handleRegistration({ username: email.value, password: password.value });
    }
  };

  const isError = Boolean(errorState);
  return (
    <form onSubmit={internalHandleRegistration}>
      <h1 id="h1-form-title" className="h3 mb-3 fw-normal">
        Please register
      </h1>
      <label htmlFor="email" className="visually-hidden">
        Email
      </label>
      <input
        id="email"
        type="email"
        className="form-control first-input"
        placeholder="Email address"
      />

      <label htmlFor="password" className="visually-hidden">
        Password
      </label>
      <input
        id="password"
        type="password"
        className="form-control second-input"
        placeholder="Password"
      />

      {isError ? <ErrorMessage>{errorState}</ErrorMessage> : null}
      <button className="w-100 btn btn-lg btn-primary" type="submit">
        Register
      </button>
    </form>
  );
};

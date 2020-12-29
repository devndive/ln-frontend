import React from "react";
import { ErrorMessage } from ".";

export interface ResetPasswordFormData {
  username: string;
}

interface ResetPasswordFormProps {
  handleResetPassword: (data: ResetPasswordFormData) => void;
  error: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  handleResetPassword,
  error,
}) => {
  const [errorState, setErrorState] = React.useState(error);

  const internalHandleResetPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // @ts-ignore
    const { username } = event.target.elements;

    if (!username.value) {
      setErrorState("Please provide a username.");
      return;
    } else {
      handleResetPassword({ username: username.value });
    }
  };

  const isError = Boolean(errorState);

  return (
    <form onSubmit={internalHandleResetPassword}>
      <h1 id="h1-form-title" className="h3 mb-3 fw-normal">
        Please provide your username
      </h1>

      <label htmlFor="username" className="visually-hidden">
        Username
      </label>
      <input
        id="username"
        type="text"
        className="form-control single-input"
        placeholder="Username"
      />

      {isError ? <ErrorMessage>{errorState}</ErrorMessage> : null}

      <button className="w-100 btn btn-lg btn-primary" type="submit">
        Send code
      </button>
    </form>
  );
};

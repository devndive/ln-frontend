import React from "react";
import { ErrorMessage } from ".";

export interface ResetPasswordNewPasswordFormData {
  code: string;
  newPassword: string;
}

interface ResetPasswordNewPasswordFormProps {
  handleNewPassword: (data: ResetPasswordNewPasswordFormData) => void;
  error: string;
}

export const ResetPasswordNewPasswordForm: React.FC<ResetPasswordNewPasswordFormProps> = ({
  handleNewPassword,
  error,
}) => {
  const [errorState, setErrorState] = React.useState(error);

  const internalHandleNewPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // @ts-ignore
    const { code, password } = event.target.elements;

    if (!code.value && !password.value) {
      setErrorState("Please provide the verification code and new password.");
      return;
    } else {
      handleNewPassword({ code: code.value, newPassword: password.value });
    }
  };

  const isError = Boolean(errorState);

  return (
    <form onSubmit={internalHandleNewPassword}>
      <h1 id="h1-form-title" className="h3 mb-3 fw-normal">
        Please provide the code and new password
      </h1>

      <label htmlFor="code" className="visually-hidden">
        Verification code
      </label>
      <input
        id="code"
        type="text"
        className="form-control first-input"
        placeholder="Verification code"
      />

      <label htmlFor="password" className="visually-hidden">
        New password
      </label>
      <input
        id="password"
        type="password"
        className="form-control second-input"
        placeholder="Password"
      />

      {isError ? <ErrorMessage>{errorState}</ErrorMessage> : null}

      <button className="w-100 btn btn-lg btn-primary" type="submit">
        Reset password
      </button>
    </form>
  );
};

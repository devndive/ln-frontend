import React from "react";
import { ErrorMessage } from ".";

export interface RegistrationConfirmationData {
  code: string;
}

interface RegistrationConfirmationProps {
  handleRegistrationConfirmation: (data: RegistrationConfirmationData) => void;
  error: string;
}

export const RegistrationConfirmationForm: React.FC<RegistrationConfirmationProps> = ({
  handleRegistrationConfirmation,
  error,
}) => {
  const [errorState, setErrorState] = React.useState(error);
  const internalHandleRegistrationConfirmation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // @ts-ignore
    const { code } = event.target.elements;

    if (!code.value) {
      setErrorState("You need to provide the confirmation code.");
      return;
    } else {
      handleRegistrationConfirmation({ code: code.value });
    }
  };

  const isError = Boolean(errorState);

  return (
    <form onSubmit={internalHandleRegistrationConfirmation}>
      <h1 id="h1-form-title" className="h3 mb-3 fw-normal">
        Please verify your email
      </h1>

      <label htmlFor="code" className="visually-hidden">
        Verification code
      </label>
      <input
        id="code"
        type="text"
        className="form-control single-input"
        placeholder="Verification code"
      />

      {isError ? <ErrorMessage>{errorState}</ErrorMessage> : null}

      <button className="w-100 btn btn-lg btn-primary" type="submit">
        Verify
      </button>
    </form>
  );
};

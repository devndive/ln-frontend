import React from "react";

import "./index.scss";
import "./signin.scss";
import "@reach/dialog/styles.css";

import { ErrorMessage } from "./components";
import { useAuth } from "./AuthProvider";
import { Logger } from "./Logger";
import { DialogContent, DialogOverlay } from "@reach/dialog";
import { VisuallyHidden } from "@reach/visually-hidden";

import { animated, useTransition } from "react-spring";
import { RegistrationForm, RegistrationFormData } from "./components/RegistrationForm";
import {
  RegistrationConfirmationForm,
  RegistrationConfirmationData,
} from "./components/RegistrationConfirmationForm";
import { ResetPasswordForm, ResetPasswordFormData } from "./components/ResetPasswordForm";
import {
  ResetPasswordNewPasswordForm,
  ResetPasswordNewPasswordFormData,
} from "./components/ResetPasswordNewPasswordForm";

const STEP_REGISTER = "REGISTER";
const STEP_VERIFY = "VERIFY";
const STEP_RESET_PASSWORD_USERNAME = "RESET_PASSWORD_USERNAME";
const STEP_RESET_PASSWORD_NEW_PASSWORD = "RESET_PASSWORD_NEW_PASSWORD";

export const UnauthenticatedApp = () => {
  const [state, setState] = React.useState({
    error: "",
    showDialog: false,
    currentStep: "",
    tmpEmail: "",
    tmpPassword: "",
  });

  const close = () => setState({ ...state, showDialog: false, currentStep: "" });

  const { signIn, register, confirmRegistration, forgotPassword, forgotPasswordSubmit } = useAuth();

  const handleError = (e: any) => {
    Logger.error(e);
    setState({ ...state, error: e.message });
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ ...state, error: "" });

    // @ts-ignore
    const { email, password } = event.target.elements;

    signIn({
      email: email.value,
      password: password.value,
    });
  };

  const handleRegistration = ({ username, password }: RegistrationFormData) => {
    setState((prevState) => ({
      ...prevState,
      error: "",
      tmpEmail: username,
      tmpPassword: password,
    }));

    register({
      email: username,
      password,
    })
      .then(() => setState((prevState) => ({ ...prevState, currentStep: STEP_VERIFY })))
      .catch(handleError);
  };

  const handleRegistrationConfirmation = ({ code }: RegistrationConfirmationData) => {
    setState({ ...state, error: "" });

    confirmRegistration({
      email: state.tmpEmail,
      code: code,
    })
      .then(() => {
        signIn({ email: state.tmpEmail, password: state.tmpPassword });
      })
      .catch(handleError);
  };

  const handleResetPassword = () => {
    setState({
      ...state,
      showDialog: true,
      currentStep: STEP_RESET_PASSWORD_USERNAME,
    });
  };

  const handleResetPasswordUsername = ({ username }: ResetPasswordFormData) => {
    setState({ ...state, error: "", tmpEmail: username });

    forgotPassword({
      username: username,
    }).then(() => {
      setState({ ...state, currentStep: STEP_RESET_PASSWORD_NEW_PASSWORD });
    });
  };

  const handleResetPasswordNewPassword = ({
    code,
    newPassword,
  }: ResetPasswordNewPasswordFormData) => {
    setState({ ...state, error: "", tmpPassword: newPassword });

    forgotPasswordSubmit({
      username: state.tmpEmail,
      code: code,
      newPassword,
    })
      .then(() => signIn({ email: state.tmpEmail, password: state.tmpPassword }))
      .catch(handleError);
  };

  const AnimatedDialogOverlay = animated(DialogOverlay);
  const AnimatedDialogContent = animated(DialogContent);

  const transitions = useTransition(state.showDialog, {
    from: { opacity: 0, transform: "translate3d(0,-40px,0)" },
    enter: { opacity: 1, transform: "translate3d(0,0px,0)" },
    leave: { opacity: 0, transform: "translate3d(0,-40px,0)" },
  });

  const isError = Boolean(state.error);

  return (
    <main className="form-signin mt-5">
      {transitions(({ opacity, transform }, item) => (
        <AnimatedDialogOverlay as="div" style={{ opacity: opacity }}>
          <AnimatedDialogContent
            as="div"
            style={{ transform: transform }}
            aria-labelledby="h1-form-title"
          >
            <div className="form-signin-dialog">
              <button className="close-button float-end" onClick={close}>
                <VisuallyHidden>Close</VisuallyHidden>
                <span aria-hidden>x</span>
              </button>
              {state.currentStep === STEP_REGISTER && (
                <RegistrationForm handleRegistration={handleRegistration} error={state.error} />
              )}

              {state.currentStep === STEP_VERIFY && (
                <RegistrationConfirmationForm
                  handleRegistrationConfirmation={handleRegistrationConfirmation}
                  error={state.error}
                />
              )}

              {state.currentStep === STEP_RESET_PASSWORD_USERNAME && (
                <ResetPasswordForm
                  handleResetPassword={handleResetPasswordUsername}
                  error={state.error}
                />
              )}

              {state.currentStep === STEP_RESET_PASSWORD_NEW_PASSWORD && (
                <ResetPasswordNewPasswordForm
                  handleNewPassword={handleResetPasswordNewPassword}
                  error={state.error}
                />
              )}
            </div>
          </AnimatedDialogContent>
        </AnimatedDialogOverlay>
      ))}
      <form onSubmit={handleLogin}>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
        <label htmlFor="email" className="visually-hidden">
          Email
        </label>
        <input id="email" type="email" className="form-control" placeholder="Email address" />

        <label htmlFor="password" className="visually-hidden">
          Password
        </label>
        <input id="password" type="password" className="form-control" placeholder="Password" />

        {isError ? <ErrorMessage>{state.error}</ErrorMessage> : null}

        <p>
          Forgot your password?
          <button
            type="button"
            className="btn btn-link"
            style={{ paddingLeft: "4px", paddingTop: "0px", paddingBottom: "4px" }}
            onClick={() => handleResetPassword()}
          >
            Reset password
          </button>
        </p>

        <button
          type="button"
          className="btn btn-link "
          onClick={() => {
            setState({ ...state, currentStep: STEP_REGISTER, showDialog: true });
          }}
          style={{ paddingLeft: "0px" }}
        >
          No account? Register!
        </button>
        <button className="w-40 float-end btn btn-primary" type="submit">
          Login
        </button>
      </form>
    </main>
  );
};

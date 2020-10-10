import React from "react";

import { gql, useMutation } from "@apollo/client";
import { useHistory, useLocation } from "react-router-dom";
import classnames from 'classnames';
import { useForm } from 'react-hook-form';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const Login = ({ setIsAuthenticated }: { setIsAuthenticated: (state: boolean) => void }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const [error, setError] = React.useState("");

  const [login] = useMutation(LOGIN_MUTATION);

  const history = useHistory();
  const location = useLocation<{ from: { pathname: string } }>();

  const { register, handleSubmit, errors } = useForm();

  const { from } = location.state || { from: { pathname: "/links" } };
  const onSubmit = ({ email, password }: { email: string, password: string}) => {
    setIsLoading(true);
    login({ variables: { email, password } })
      .then((result) => {
        window.localStorage.setItem("token", result.data.login.token);
        setIsAuthenticated(true);
        setIsLoading(false);
        setError("");

        history.replace(from);
      })
      .catch((e) => {
        console.log(e);
        if (e && e.message) {
          setError(e.message);
        } else {
          setError("Unexpected error. Please try again");
        }

        setIsLoading(false);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Login</h1>

      <div className="mb-3 row">
        <label htmlFor="email" className="col-sm-2 col-form-label">
          Email
        </label>
        <div className="col-sm-10">
          <input
            id="email"
            type="text"
            name="email"
            className={classnames("form-control", { "is-invalid": errors.email })}
            ref={register({ required: true })}
            defaultValue={""}
          />
          {errors.email && <div className=" invalid-feedback ">Please provide an email address</div> }
        </div>
      </div>
      <div className="mb-3 row">
        <label htmlFor="password" className="col-sm-2 col-form-label">
          Password
        </label>
        <div className="col-sm-10">
          <input
            id="password"
            type="password"
            name="password"
            className={classnames("form-control", { "is-invalid": errors.password })}
            ref={register({ required: true })}
            defaultValue={""}
          />
          {errors.password && <div className="invalid-feedback">Please provide a password.</div> }
        </div>
      </div>

      {isLoading && <p>Loading ...</p>}
      {error && <p>Error: {error}</p>}

      <button
        className="btn btn-primary"
        name="loginButton"
        type="submit"
      >
        Login
      </button>
      </form>
    </div>
  );
};

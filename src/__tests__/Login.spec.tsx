import React from "react";

import { Login, LOGIN_MUTATION } from "../pages/Login";

import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { act } from "react-dom/test-utils";
import { GraphQLError } from "graphql";

describe("LoginComponent", () => {
  it("should render without error", async () => {
    const setIsAuthenticated = () => {};

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemoryRouter>
          <Login setIsAuthenticated={setIsAuthenticated} />
        </MemoryRouter>
      </MockedProvider>
    );

    expect(await screen.findByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("should redirect to Links after successful login", async () => {
    const setIsAuthenticated = () => {};

    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: {
            email: "some.one@example.com",
            password: "something",
          },
        },
        result: () => {
          return { data: { login: { token: "some.jw.token" } } };
        },
      },
    ];

    const memoryHistory = createMemoryHistory();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router history={memoryHistory}>
          <Login setIsAuthenticated={setIsAuthenticated} />
        </Router>
      </MockedProvider>
    );

    userEvent.paste(screen.getByLabelText("Email"), "some.one@example.com");
    userEvent.paste(screen.getByLabelText("Password"), "something");

    userEvent.click(screen.getByRole("button", { name: /Login/i }));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(memoryHistory.location.pathname).toBe("/links");
  });

  it("should show error in case of an error from backend", async () => {
    const setIsAuthenticated = () => {};

    const mocks = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: {
            email: "some.one@example.com",
            password: "something",
          },
        },
        result: () => {
          return {
            errors: [new GraphQLError("Login failed")],
            data: { login: null },
          };
        },
      },
    ];

    const memoryHistory = createMemoryHistory();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router history={memoryHistory}>
          <Login setIsAuthenticated={setIsAuthenticated} />
        </Router>
      </MockedProvider>
    );

    userEvent.paste(screen.getByLabelText("Email"), "some.one@example.com");
    userEvent.paste(screen.getByLabelText("Password"), "something");

    userEvent.click(screen.getByRole("button", { name: /Login/i }));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(memoryHistory.location.pathname).toBe("/");
    expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
  });
});

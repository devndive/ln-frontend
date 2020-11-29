import React from "react";

import { ApolloProvider } from "@apollo/client";
import { createHttpLink, from, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import { Auth } from "aws-amplify";
import { Logger } from "./Logger";

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_BACKEND_URL,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    const authError = graphQLErrors.find((e) => e.message.includes("Not Authorized"));

    if (authError) {
      localStorage.removeItem("token");
    }

    graphQLErrors.map(({ message, locations, path }) =>
      Logger.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }

  if (networkError) Logger.error(`[Network error]: ${networkError}`);
});

export const AuthorizedApolloProvider: React.FC = ({ children }) => {
  const authLink = setContext(async (_, { headers }) => {
    const user = await Auth.currentAuthenticatedUser();

    if (user) {
      const token = user.signInUserSession.idToken.jwtToken;

      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    }
  });

  const link = from([authLink, errorLink, httpLink]);

  const createApolloClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache({
      typePolicies: {
        Tag: {
          keyFields: ["name"],
        },
        Query: {
          fields: {
            link(_, { args, toReference }) {
              return toReference({
                __typename: "Link",
                id: args?.id,
              });
            },
            metadata(_, { args, toReference }) {
              return toReference({
                __typename: "Metadata",
                id: args?.id,
              });
            },
            tag(_, { args, toReference }) {
              return toReference({
                __typename: "Tag",
                name: args?.name,
              });
            },
          },
        },
      },
    }),
    connectToDevTools: true,
  });

  return <ApolloProvider client={createApolloClient}>{children}</ApolloProvider>;
};

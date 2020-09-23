import { createHttpLink, from, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_BACKEND_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    const authError = graphQLErrors.find((e) => e.message.includes("Not Authorized"));

    if (authError) {
      localStorage.removeItem("token");
    }

    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = from([authLink, errorLink, httpLink]);

export const createApolloClient = () => {
  return new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
  });
};

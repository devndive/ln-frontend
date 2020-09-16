import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import { App } from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_BACKEND_URL,
});


const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ?`Bearer ${token}` : "",
    }
  }
});

const errorLink = onError(({ graphQLErrors, networkError}) => {
  if (graphQLErrors) {

    const authError = graphQLErrors.find(e => e.message.includes("Not Authorized"));
    if (authError) {
      localStorage.removeItem('token');
    }

    graphQLErrors.map(({ message, locations, path }) => 
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = from([
  authLink,
  errorLink,
  httpLink,
])

const client = new ApolloClient({
  link:  link,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

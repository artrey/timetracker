import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloLink, concat } from "apollo-link";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { getToken } from "./token";

const httpLink = new HttpLink({ uri: "http://localhost:8000/graphql/" });

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = getToken();
  console.log(operation);
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : ""
    }
  }));

  return forward(operation);
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from "react";
import "@patternfly/react-core/dist/styles/base.css";
import { AppLayout as Layout } from "use-patternfly";
import { useHistory } from "react-router-dom";
import { Brand, Avatar } from "@patternfly/react-core";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import NavToolBar from "components/NavToolBar/NavToolBar";
import { AppRoutes } from "AppRoutes";
import brandImg from "./brand_logo.svg";
import avatarImg from "./img_avatar.svg";
import "./App.css";
import { ServerMessageAlert } from "./components/common";
import { useErrorContext } from "context-state-reducer";

let history: any;
let dispactAction: any;
let hasServerError: any;

const graphqlEndpoint = process.env.REACT_APP_GRAPHQL_ENDPOINT
  ? process.env.REACT_APP_GRAPHQL_ENDPOINT
  : "http://localhost:4000";
const client = new ApolloClient({
  uri: graphqlEndpoint,
  onError(error: any) {
    const { graphQLErrors, networkError } = error;
    if (networkError && !graphQLErrors) {
      history && history.push("/server-error");
    } else if (graphQLErrors) {
      hasServerError !== true &&
        dispactAction &&
        dispactAction({ type: "SET_SERVER_ERROR", payload: error });
    }
  }
});

const avatar = (
  <React.Fragment>
    <Avatar src={avatarImg} alt="avatar" />
  </React.Fragment>
);

const logo = <Brand src={brandImg} alt="Console Logo" />;

const AppLayout: React.FC = () => {
  history = useHistory();
  const { dispatch, state } = useErrorContext();
  hasServerError = state && state.hasServerError;
  dispactAction = dispatch;
  const logoProps = React.useMemo(
    () => ({
      onClick: () => history.push("/")
    }),
    [history]
  );

  return (
    <ApolloProvider client={client}>
      <Layout
        logoProps={logoProps}
        logo={logo}
        avatar={avatar}
        toolbar={<NavToolBar />}
      >
        <ServerMessageAlert />
        <AppRoutes />
      </Layout>
    </ApolloProvider>
  );
};

export default AppLayout;

/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from "react";
import "@patternfly/react-core/dist/styles/base.css";
import { AppLayout } from "use-patternfly";
import { useHistory } from "react-router-dom";
import { Brand, Avatar } from "@patternfly/react-core";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import NavToolBar from "components/NavToolBar/NavToolBar";
import { AppRoutes } from "AppRoutes";
import brandImg from "./brand_logo.svg";
import avatarImg from "./img_avatar.svg";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import "./App.css";
import { ErrorProvider, useErrorReducer } from "context-state-reducer";
import { ServerErrorAlert } from "./components/common";

const graphqlEndpoint = process.env.REACT_APP_GRAPHQL_ENDPOINT
  ? process.env.REACT_APP_GRAPHQL_ENDPOINT
  : "http://localhost:4000";
const client = new ApolloClient({
  uri: graphqlEndpoint
});

const avatar = (
  <React.Fragment>
    <Avatar src={avatarImg} alt="avatar" />
  </React.Fragment>
);

const logo = <Brand src={brandImg} alt="Console Logo" />;

const App: React.FC = () => {
  const history = useHistory();
  const logoProps = React.useMemo(
    () => ({
      onClick: () => history.push("/")
    }),
    [history]
  );

  const [contextValue] = useErrorReducer();

  return (
    <ApolloProvider client={client}>
      <ErrorProvider value={contextValue}>
        <ErrorBoundary>
          <AppLayout
            logoProps={logoProps}
            logo={logo}
            avatar={avatar}
            toolbar={<NavToolBar />}
          >
            <ServerErrorAlert />
            <AppRoutes />
          </AppLayout>
        </ErrorBoundary>
      </ErrorProvider>
    </ApolloProvider>
  );
};

export default App;

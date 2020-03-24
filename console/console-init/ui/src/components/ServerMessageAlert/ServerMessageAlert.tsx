/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { useState, useEffect } from "react";
import {
  Alert,
  AlertActionCloseButton,
  List,
  ListItem,
  PageSection
} from "@patternfly/react-core";
import { useStoreContext, types } from "context-state-reducer";

export const ServerMessageAlert: React.FC = () => {
  const { state, dispatch } = useStoreContext();
  const { hasServerError, errors } = state && state.error;
  const [alertVisible, setAlertVisible] = useState(true);

  const onClose = () => {
    setAlertVisible(false);
    dispatch({ type: types.RESET_SERVER_ERROR });
  };

  const getErrorMessage = () => {
    let message: string = "Something went wrong, please try again...";
    if (errors && Array.isArray(errors)) {
      return (
        <List>
          {errors &&
            errors.map((error: any, index: number) => {
              const { networkError, graphQLErrors } = error;
              if (graphQLErrors && graphQLErrors.length > 0) {
                message = graphQLErrors[0].message;
              } else {
                message =
                  networkError &&
                  networkError.result &&
                  networkError.result.errors[0] &&
                  networkError.result.errors[0].message;
              }
              return <ListItem key={index}>{message}</ListItem>;
            })}
        </List>
      );
    }

    return message;
  };

  useEffect(() => {
    hasServerError !== undefined && setAlertVisible(hasServerError);
  }, [hasServerError]);

  if (hasServerError && alertVisible) {
    return (
      <PageSection>
        <Alert
          variant="danger"
          title="Server Error"
          action={<AlertActionCloseButton onClose={onClose} />}
        >
          {getErrorMessage()}
        </Alert>
      </PageSection>
    );
  }
  return null;
};

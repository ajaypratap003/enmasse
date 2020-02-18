import React, { useState, useEffect } from "react";
import { Alert, AlertActionCloseButton } from "@patternfly/react-core";

import { useErrorContext, RESET_SERVER_ERROR } from "context-state-reducer";

export const ServerMessageAlert: React.FC = () => {
  const { state, dispatch } = useErrorContext();
  const { hasServerError, errors } = state;
  const [alertVisible, setAlertVisible] = useState(true);

  const onClose = () => {
    setAlertVisible(false);
    dispatch({ type: RESET_SERVER_ERROR });
  };

  useEffect(() => {
    hasServerError !== undefined && setAlertVisible(hasServerError);
  }, [hasServerError]);

  if (hasServerError && alertVisible) {
    return (
      <Alert
        variant="danger"
        title="Server Error"
        action={<AlertActionCloseButton onClose={onClose} />}
      >
        {errors && errors.message}
      </Alert>
    );
  }
  return null;
};

import React from "react";
import { Alert, AlertActionCloseButton } from "@patternfly/react-core";

import { useErrorContext } from "context-state-reducer";

export const ServerMessageAlert: React.FC = () => {
  const { state } = useErrorContext();
  const { hasServerError, errors } = state;
  const [alertVisible, setAlertVisible] = React.useState(true);

  const onClose = () => {
    setAlertVisible(false);
  };

  if (hasServerError && alertVisible) {
    return (
      <Alert
        variant="danger"
        title="Danger alert title"
        action={<AlertActionCloseButton onClose={onClose} />}
      >
        {errors && errors.message}
      </Alert>
    );
  }
  return null;
};

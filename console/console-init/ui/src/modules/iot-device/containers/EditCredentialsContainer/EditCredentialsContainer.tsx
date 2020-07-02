/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from "react";
import {
  Title,
  Flex,
  FlexItem,
  Button,
  ButtonVariant
} from "@patternfly/react-core";
import { useParams } from "react-router";
import { useQuery } from "@apollo/react-hooks";
import { AddCredential } from "modules/iot-device/components";
import { useStoreContext, types } from "context-state-reducer";
import { RETURN_IOT_CREDENTIALS } from "graphql-module/queries";
import { ICredentialsReponse } from "schema";
import { Loading } from "use-patternfly";

export const EditCredentialsContainer = () => {
  const { dispatch } = useStoreContext();
  const { projectname, deviceid } = useParams();

  const { data, loading } = useQuery<ICredentialsReponse>(
    RETURN_IOT_CREDENTIALS(projectname, deviceid)
  );
  const { credentials } = data?.credentials || {};
  const credentialList = credentials && JSON.parse(credentials);

  if (loading) {
    return <Loading />;
  }

  const resetActionType = () => {
    dispatch({ type: types.RESET_DEVICE_ACTION_TYPE });
  };

  const onSave = () => {
    /**
     * TODO: implement save query
     */
    resetActionType();
  };

  const onCancel = () => {
    resetActionType();
  };

  return (
    <>
      <Title headingLevel="h2" size="xl">
        Edit credentials
      </Title>
      <br />
      <AddCredential iotCredentials={credentialList} />
      <br />
      <br />
      <Flex>
        <FlexItem>
          <Button
            id="ec-save-credentials-button"
            variant={ButtonVariant.primary}
            onClick={onSave}
          >
            Save
          </Button>
        </FlexItem>
        <FlexItem>
          <Button
            id="ec-cancel-credentials-button"
            variant={ButtonVariant.secondary}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </FlexItem>
      </Flex>
    </>
  );
};

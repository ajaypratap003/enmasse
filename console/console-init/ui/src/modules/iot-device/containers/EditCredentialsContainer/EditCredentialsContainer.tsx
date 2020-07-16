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
  ButtonVariant,
  Grid,
  GridItem
} from "@patternfly/react-core";
import { useParams } from "react-router";
import { useQuery } from "@apollo/react-hooks";
import { AddCredential } from "modules/iot-device/components";
import { useStoreContext, types } from "context-state-reducer";
import { RETURN_IOT_CREDENTIALS } from "graphql-module/queries";
import { ICredentialsReponse } from "schema";
import { Loading } from "use-patternfly";
import { OperationType } from "constant";
import styles from "./edit-credentials.module.css";

export const EditCredentialsContainer = () => {
  const { dispatch } = useStoreContext();
  const { projectname, deviceid, namespace } = useParams();

  const { data, loading } = useQuery<ICredentialsReponse>(
    RETURN_IOT_CREDENTIALS(projectname, namespace, deviceid)
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
    <Grid>
      <GridItem span={6}>
        <Title headingLevel="h2" size="xl" className={styles.marginLeft}>
          Edit credentials
        </Title>
        <br />
        <AddCredential
          credentials={credentialList}
          operation={OperationType.EDIT}
        />
        <br />
        <Flex className={styles.marginLeft}>
          <FlexItem>
            <Button
              id="edit-credentials-save-button"
              variant={ButtonVariant.primary}
              onClick={onSave}
            >
              Save
            </Button>
          </FlexItem>
          <FlexItem>
            <Button
              id="edit-credentials-cancel-button"
              variant={ButtonVariant.secondary}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </FlexItem>
        </Flex>
      </GridItem>
    </Grid>
  );
};

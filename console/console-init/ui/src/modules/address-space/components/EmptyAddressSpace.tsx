/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from "react";
import {
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateVariant,
  Button,
  ButtonVariant
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { useStoreContext, types, MODAL_TYPES } from "context-state-reducer";

export const EmptyAddressSpace: React.FunctionComponent<{}> = () => {
  const { dispatch } = useStoreContext();

  const onCreateAddressSpace = () => {
    dispatch({
      type: types.SHOW_MODAL,
      modalType: MODAL_TYPES.CREATE_ADDRESS_SPACE
    });
  };

  return (
    <EmptyState variant={EmptyStateVariant.full} id="empty-ad-space">
      <EmptyStateIcon icon={PlusCircleIcon} />
      <Title id="empty-ad-space-title" size="lg">
        Create an address space
      </Title>
      <EmptyStateBody id="empty-ad-space-body">
        There are currently no address spaces available. Please click on the
        button below to create one.Learn more about this in the
        <a href={process.env.REACT_APP_DOCS}> documentation</a>
      </EmptyStateBody>
      <Button
        id="empty-ad-space-create-button"
        variant={ButtonVariant.primary}
        onClick={onCreateAddressSpace}
      >
        Create Address Space
      </Button>
    </EmptyState>
  );
};

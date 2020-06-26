/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { useState } from "react";
import {
  PageSection,
  PageSectionVariants,
  Button,
  Grid,
  GridItem
} from "@patternfly/react-core";
import { StyleSheet, css } from "aphrodite";
import { JsonEditor } from "components";
import {
  AddJsonUsingTemplate,
  connectedViaGatewayDeviceTemplate,
  directlyConnectedDeviceTemplate
} from "./AddJsonUsingTemplate";
import { compareObject, getFormattedJsonString } from "utils";
import { types, MODAL_TYPES, useStoreContext } from "context-state-reducer";
import { DeviceListAlert } from "modules/iot-device";
import { TemplateType } from "constant";

const styles = StyleSheet.create({
  box_align_style: {
    minHeight: "40em",
    maxHeight: "40em",
    border: "1px solid",
    borderColor: "grey",
    padding: 20,
    marginRight: 20
  }
});
interface IAddDeviceWithJsonProps {}

const AddDeviceWithJson: React.FunctionComponent<IAddDeviceWithJsonProps> = () => {
  const { dispatch } = useStoreContext();
  const [deviceDetail, setDeviceDetail] = useState<string>();
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    TemplateType.DIRECTLY_CONNECTED
  );
  const [showJsonValidationError, setShowJsonValidationError] = useState<
    boolean
  >(false);

  const setDeviceInfoInDetail = (value?: string) => {
    if (showJsonValidationError) {
      setShowJsonValidationError(false);
    }
    setDeviceDetail(value);
  };

  const onLeaveModal = () => {
    //TODO: handle onConfirm event for modal
  };

  const onCancel = () => {
    let isJsonPresent: boolean = false;
    try {
      const detail = deviceDetail && JSON.parse(deviceDetail);
      if (detail && selectedTemplate === TemplateType.DIRECTLY_CONNECTED) {
        if (!compareObject(detail, directlyConnectedDeviceTemplate)) {
          isJsonPresent = true;
        }
      } else if (selectedTemplate === TemplateType.VIA_GATEWAY) {
        if (!compareObject(detail, connectedViaGatewayDeviceTemplate)) {
          isJsonPresent = true;
        }
      }
    } catch {
      if (deviceDetail) isJsonPresent = true;
    }
    if (isJsonPresent) {
      dispatch({
        type: types.SHOW_MODAL,
        modalType: MODAL_TYPES.LEAVE_CREATE_DEVICE,
        modalProps: {
          onConfirm: onLeaveModal,
          option: "Leave",
          detail: `Do you want to leave this creation page without saving? All information will be lost.`,
          header: "Leave without saving ?",
          confirmButtonLabel: "Leave"
        }
      });
    }
  };

  const isJsonValid = () => {
    try {
      if (!deviceDetail || deviceDetail.trim() === "") {
        if (deviceDetail !== "") {
          setDeviceInfoInDetail(undefined);
        }
        return true;
      }
      const detail = JSON.parse(deviceDetail.trim());
      if (detail) {
        setDeviceInfoInDetail(getFormattedJsonString(detail));
        return true;
      }
    } catch {
      return false;
    }
  };
  const onFinish = () => {
    if (!isJsonValid()) {
      setShowJsonValidationError(true);
    } else {
    }
  };
  const onPreview = () => {
    if (!isJsonValid()) {
      setShowJsonValidationError(true);
    } else {
    }
  };

  return (
    <PageSection variant={PageSectionVariants.light}>
      <DeviceListAlert
        id="alert-error-invalid-json"
        variant="danger"
        isInline
        visible={showJsonValidationError}
        title="Error"
        description="Invalid JSON syntax, unable to parse JSON"
      />

      <br />
      <Grid>
        <GridItem span={9} className={css(styles.box_align_style)}>
          <JsonEditor
            value={deviceDetail}
            readOnly={false}
            name={"editor-add-device"}
            setDetail={setDeviceInfoInDetail}
            style={{
              minHeight: "39em"
            }}
          />
        </GridItem>
        <GridItem span={3} className={css(styles.box_align_style)}>
          <PageSection variant={PageSectionVariants.light}>
            <AddJsonUsingTemplate
              setDetail={setDeviceInfoInDetail}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
            />
          </PageSection>
        </GridItem>
      </Grid>
      <br />

      <Button variant="primary" onClick={onFinish}>
        Finish
      </Button>
      {"  "}
      <Button variant="secondary" onClick={onPreview}>
        Preview
      </Button>
      {"  "}
      <Button variant="link" onClick={onCancel}>
        Cancel
      </Button>
    </PageSection>
  );
};

export { AddDeviceWithJson };

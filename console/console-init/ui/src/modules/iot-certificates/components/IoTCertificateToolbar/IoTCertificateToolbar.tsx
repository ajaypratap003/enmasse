/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from "react";
import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button
} from "@patternfly/react-core";
import { SwitchWithToggle } from "components";

export interface IIoTCertificateToolbarProps {
  setShowCertificateForm: React.Dispatch<React.SetStateAction<boolean>>;
  isJsonView: boolean;
  handleJsonViewChange: (val: boolean) => void;
}

export const IoTCertificateToolbar: React.FunctionComponent<IIoTCertificateToolbarProps> = ({
  setShowCertificateForm,
  isJsonView,
  handleJsonViewChange
}) => {
  const handleAddCertificateClick = () => {
    setShowCertificateForm(true);
  };

  const handleUploadCertificateClick = () => {
    // TODO: Mechanism to upload a certificate
  };

  return (
    <Toolbar id="pct-data-toolbar" data-codemods="true">
      <ToolbarContent>
        <ToolbarItem data-codemods="true">
          <Button
            id="pct-add-certificate-button"
            onClick={handleAddCertificateClick}
          >
            Add certificate
          </Button>
        </ToolbarItem>
        <ToolbarItem data-codemods="true">
          <Button
            id="pct-upload-certificate-button"
            variant="link"
            onClick={handleUploadCertificateClick}
          >
            Upload certificate
          </Button>
        </ToolbarItem>
        <ToolbarItem alignment={{ md: "alignRight" }} data-codemods="true">
          <SwitchWithToggle
            id="pct-edit-json-switch"
            label="Edit in Json"
            isChecked={isJsonView}
            onChange={handleJsonViewChange}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

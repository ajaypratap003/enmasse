import React from "react";

import { DialoguePrompt } from "components/common/DialoguePrompt";

const MODAL_COMPONENTS: any = {
  DELETE_DIALOG: DialoguePrompt
};

export interface IRootModalProps {
  modalType: string;
  modalProps: any;
}

export const RootModal: React.FC<IRootModalProps> = ({
  modalType,
  modalProps
}) => {
  if (!modalType) {
    return null;
  }
  const Component = MODAL_COMPONENTS[modalType];
  return <Component {...modalProps} />;
};

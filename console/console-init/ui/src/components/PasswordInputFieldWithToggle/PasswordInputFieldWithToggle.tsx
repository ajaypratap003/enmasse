/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { useState } from "react";
import { TextInput, TextInputProps } from "@patternfly/react-core";
import { EyeIcon, EyeSlashIcon } from "@patternfly/react-icons";
// import { StyleSheet } from "@patternfly/react-styles";

// const styles = StyleSheet.create({
//   icon: {
//     minWidth: 35
//   },
//   textInput: {
//     marginRight: -35
//   }
// });

export interface IPasswordInputFieldWithToggleProps extends TextInputProps {
  id: string;
}

export const PasswordInputFieldWithToggle: React.FC<IPasswordInputFieldWithToggleProps> = ({
  id,
  onChange,
  name,
  validated = true
}) => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const onToggle = (isShowPassword: boolean) => {
    setIsShowPassword(isShowPassword);
  };

  const renderIcon = () => {
    if (validated) {
      if (isShowPassword) {
        return (
          <EyeSlashIcon
            // className={styles.icon}
            onClick={() => onToggle(false)}
          />
        );
      }
      return (
        <EyeIcon
          // className={styles.icon}
          onClick={() => onToggle(true)}
        />
      );
    }
  };

  const type = isShowPassword ? "text" : "password";

  return (
    <>
      <TextInput
        // className={styles.textInput}
        id={id}
        name={name}
        type={type}
        onChange={onChange}
        validated={validated ? "default" : "error"}
        // validated={validated}
      />
      {renderIcon()}
    </>
  );
};

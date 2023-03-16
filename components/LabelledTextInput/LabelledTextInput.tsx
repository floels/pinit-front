import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./LabelledTextInput.module.css";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";
import React, { forwardRef, useState } from "react";

type LabelledTextInputProps = {
  name: string;
  type: "text" | "email" | "password";
  labelMessage?: MessageDescriptor;
  placeholderMessage?: MessageDescriptor;
  errorMessageId?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  withPasswordShowIcon?: boolean;
};

const LabelledTextInput = React.forwardRef<
  HTMLInputElement,
  LabelledTextInputProps & React.ComponentPropsWithoutRef<"input">
>(
  (
    {
      name,
      type,
      labelMessage,
      placeholderMessage,
      value,
      errorMessageId,
      onChange,
      withPasswordShowIcon,
      ...otherInputProps
    },
    inputRef
  ) => {
    const intl = useIntl();

    const displayPasswordShowIcon = type == "password" && withPasswordShowIcon;

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={styles.container}>
        <div className={styles.labelContainer}>
          <label htmlFor={name} className={styles.label}>
            {labelMessage ? intl.formatMessage(labelMessage) : ""}
          </label>
        </div>
        <div className={styles.inputContainer}>
          <input
            type={type == "password" && showPassword ? "text" : type}
            name={name}
            placeholder={
              placeholderMessage ? intl.formatMessage(placeholderMessage) : ""
            }
            value={value}
            onChange={onChange}
            {...otherInputProps}
            className={`${styles.input} ${
              errorMessageId ? styles.inputError : ""
            }`}
            ref={inputRef}
          />
          {displayPasswordShowIcon && (
            <div className={styles.showPasswordIconContainer}>
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={toggleShowPassword}
                size="xs"
              />
            </div>
          )}
        </div>
        {errorMessageId && (
          <div className={styles.errorMessage}>
            <FontAwesomeIcon icon={faCircleXmark} />
            <div className={styles.errorText}>
              <FormattedMessage id={errorMessageId} />
            </div>
          </div>
        )}
      </div>
    );
  }
);

LabelledTextInput.displayName = "LabelledTextInput";

export default LabelledTextInput;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./LabelledTextInput.module.css";
import { useIntl } from "react-intl";
import React, { useState } from "react";

type LabelledTextInputProps = {
  name: string;
  type: "text" | "email" | "password" | "date";
  labelMessageId?: string;
  placeholderMessageId?: string;
  errorMessageId?: string;
  value: string;
  autoComplete?: string;
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
      labelMessageId,
      placeholderMessageId,
      errorMessageId,
      value,
      autoComplete,
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
        <label>
          <div className={styles.labelText}>
            {labelMessageId ? intl.formatMessage({ id: labelMessageId }) : ""}
          </div>
          <div className={styles.inputContainer}>
            <input
              name={name}
              type={type == "password" && showPassword ? "text" : type}
              placeholder={
                placeholderMessageId
                  ? intl.formatMessage({ id: placeholderMessageId })
                  : ""
              }
              value={value}
              autoComplete={autoComplete}
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
        </label>
        {errorMessageId && (
          <div className={styles.errorMessage}>
            <FontAwesomeIcon icon={faCircleXmark} />
            <div className={styles.errorText}>
              {intl.formatMessage({ id: errorMessageId })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

LabelledTextInput.displayName = "LabelledTextInput";

export default LabelledTextInput;

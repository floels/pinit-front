import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./LabelledTextInput.module.css";

type LabelledTextInputProps = {
  name: string;
  type: "text" | "email" | "password" | "date";
  label?: string;
  placeholder?: string;
  errorMessage?: string;
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
      label,
      placeholder,
      errorMessage,
      value,
      autoComplete,
      onChange,
      withPasswordShowIcon,
      ...otherInputProps
    },
    inputRef
  ) => {
    const displayPasswordShowIcon = type === "password" && withPasswordShowIcon;

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={styles.container}>
        <label>
          <div className={styles.labelText}>{label}</div>
          <div className={styles.inputContainer}>
            <input
              name={name}
              type={type == "password" && showPassword ? "text" : type}
              placeholder={placeholder}
              value={value}
              autoComplete={autoComplete}
              onChange={onChange}
              {...otherInputProps}
              className={`${styles.input} ${
                errorMessage ? styles.inputError : ""
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
        {errorMessage && (
          <div className={styles.errorMessage}>
            <FontAwesomeIcon icon={faCircleXmark} />
            <div className={styles.errorText}>{errorMessage}</div>
          </div>
        )}
      </div>
    );
  }
);

LabelledTextInput.displayName = "LabelledTextInput";

export default LabelledTextInput;

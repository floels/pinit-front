import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "./LabelledTextInput.module.css";
import { FormattedMessage, MessageDescriptor } from "react-intl";
import { useState } from "react";

type LabelledTextInputProps = {
  name: string;
  type: "text" | "email" | "password";
  label?: string;
  labelMessage?: MessageDescriptor;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  withPasswordShowIcon?: boolean;
};

const LabelledTextInput = ({
  name,
  type,
  label,
  labelMessage,
  value,
  onChange,
  withPasswordShowIcon,
}: LabelledTextInputProps) => {
  const displayPasswordShowIcon = type == "password" && withPasswordShowIcon;

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.labelContainer}>
        <label htmlFor={name} className={styles.label}>
          {labelMessage ? <FormattedMessage {...labelMessage} /> : label}
        </label>
      </div>
      <div className={styles.inputContainer}>
        <input
          type={type == "password" && showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          className={styles.input}
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
    </div>
  );
};

export default LabelledTextInput;

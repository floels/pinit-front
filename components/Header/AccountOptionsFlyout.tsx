import React from "react";
import styles from "./AccountOptionsFlyout.module.css";

type AccountOptionsFlyoutProps = {
  handleClickLogOut: () => void;
  labels: { [key: string]: string };
};

const AccountOptionsFlyout = React.forwardRef<
  HTMLDivElement,
  AccountOptionsFlyoutProps
>(({ handleClickLogOut, labels }, ref) => {
  return (
    <div ref={ref} className={styles.container}>
      <div>
        <div className={styles.sectionHeader}>
          {labels.MORE_OPTIONS}
        </div>
        <div onClick={handleClickLogOut} className={styles.sectionItem}>
          {labels.LOG_OUT}
        </div>
      </div>
    </div>
  );
});

AccountOptionsFlyout.displayName = "AccountOptionsFlyout";

export default AccountOptionsFlyout;

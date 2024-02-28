"use client";

import { useEffect } from "react";
import styles from "./LogoutTrigger.module.css";
import { useLogOutContext } from "@/contexts/logOutContext";

const LogoutTrigger = () => {
  const { logOut } = useLogOutContext();

  useEffect(() => {
    logOut();
  }, []);

  return (
    <div className={styles.overlay} data-testid="logout-trigger-overlay" />
  );
};

export default LogoutTrigger;

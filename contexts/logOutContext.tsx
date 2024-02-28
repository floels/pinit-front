"use client";

import { API_ROUTE_LOG_OUT } from "@/lib/constants";
import { toast } from "react-toastify";
import { createContext, useContext, useCallback } from "react";
import { useTranslations } from "next-intl";

export const LogOutContext = createContext<{ logOut: () => void }>({
  logOut: () => {}, // placeholder function
});

export const LogOutContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const t = useTranslations("Common");

  const logOut = useCallback(async () => {
    try {
      await fetch(API_ROUTE_LOG_OUT, {
        method: "POST",
      });

      window.location.href = "/";
    } catch {
      toast.warn(t("CONNECTION_ERROR"), {
        toastId: "toast-log-out-connection-error",
      });
    }
  }, [t]);

  return (
    <LogOutContext.Provider value={{ logOut }}>
      {children}
    </LogOutContext.Provider>
  );
};

export const useLogOutContext = () => useContext(LogOutContext);

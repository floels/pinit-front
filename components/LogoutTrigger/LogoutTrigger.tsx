"use client";

import { API_ROUTE_LOG_OUT } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";

type LogoutTriggerProps = {
  children?: React.ReactNode;
};

const LogoutTrigger = ({ children }: LogoutTriggerProps) => {
  const t = useTranslations("Common");

  const router = useRouter();

  const logOut = useCallback(async () => {
    try {
      await fetch(API_ROUTE_LOG_OUT, {
        method: "POST",
      });

      router.refresh();
    } catch (error) {
      toast.warn(t("CONNECTION_ERROR"), {
        toastId: "toast-log-out-connection-error",
      });
    }
  }, [router, t]);

  useEffect(() => {
    logOut();
  }, [logOut]);

  return children;
};

export default LogoutTrigger;

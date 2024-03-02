import { toast } from "react-toastify";
import { API_ROUTE_LOG_OUT } from "../constants";
import { useTranslations } from "next-intl";

export const useLogOut = () => {
  const t = useTranslations("Common");

  const logOut = async () => {
    try {
      await fetch(API_ROUTE_LOG_OUT, {
        method: "POST",
      });

      window.location.href = "/";
    } catch {
      toast.warn(t("LOGOUT_ERROR"), {
        toastId: "toast-log-out-error",
      });
    }
  };
  return logOut;
};

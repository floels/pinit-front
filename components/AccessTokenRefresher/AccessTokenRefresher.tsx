"use client";

import Cookies from "js-cookie";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ERROR_CODE_FETCH_FAILED,
  ERROR_CODE_REFRESH_TOKEN_FAILED,
} from "@/lib/constants";
import { refreshAccessToken } from "@/lib/utils/authentication";

const AccessTokenRefresher = () => {
  const router = useRouter();

  useEffect(() => {
    const tryRefreshAccessTokenAndFallBack = async () => {
      try {
        await refreshAccessToken();

        router.refresh();
      } catch (error) {
        const errorCode = (error as Error).message;

        if (errorCode === ERROR_CODE_FETCH_FAILED) {
          // TODO: handle this error properly
          console.warn("Fetch failed when trying to refresh tokens!");
        } else if (errorCode === ERROR_CODE_REFRESH_TOKEN_FAILED) {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");

          window.location.reload();
        }
      }
    };

    tryRefreshAccessTokenAndFallBack();
  }, [router]);

  return null;
};

export default AccessTokenRefresher;

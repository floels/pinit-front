"use client";

import Cookies from "js-cookie";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ERROR_CODE_FETCH_FAILED,
  ERROR_CODE_REFRESH_TOKEN_FAILED,
} from "@/lib/constants";
import { refreshAccessToken } from "@/lib/utils/authenticationUtils";

const AccessTokenRefresher = () => {
  useEffect(async () => {
    try {
        await refreshAccessToken();

        // TODO: remove
        console.log(
            "Successfully refreshed tokens. About to refresh the '/' route."
        );

        const router = useRouter();
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
  );

  return null;
};

export default AccessTokenRefresher;

"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ERROR_CODE_FETCH_FAILED,
  ERROR_CODE_REFRESH_TOKEN_FAILED,
} from "@/lib/constants";
import { refreshAccessToken } from "@/lib/utils/authentication";
import HomePageUnauthenticatedClient, {
  HomePageUnauthenticatedClientProps,
} from "../HomePageUnauthenticated/HomePageUnauthenticatedClient";

type AccessTokenRefresherClientProps = HomePageUnauthenticatedClientProps;

const AccessTokenRefresherClient = ({
  labels,
}: AccessTokenRefresherClientProps) => {
  const [fetchFailed, setFetchFailed] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const tryRefreshAccessTokenAndFallBack = async () => {
      try {
        await refreshAccessToken();

        router.refresh();
      } catch (error) {
        const errorCode = (error as Error).message;

        if (errorCode === ERROR_CODE_FETCH_FAILED) {
          setFetchFailed(true);
        } else if (errorCode === ERROR_CODE_REFRESH_TOKEN_FAILED) {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");

          window.location.reload();
        }
      }
    };

    tryRefreshAccessTokenAndFallBack();
  }, [router, setFetchFailed]);

  if (fetchFailed) {
    return (
      <HomePageUnauthenticatedClient
        errorCode={ERROR_CODE_FETCH_FAILED}
        labels={labels}
      />
    );
  }

  return null;
};

export default AccessTokenRefresherClient;

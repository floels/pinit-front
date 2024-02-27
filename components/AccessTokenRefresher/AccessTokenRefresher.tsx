"use client";

import { useEffect } from "react";
import {
  API_ROUTE_REFRESH_TOKEN,
  ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY,
} from "@/lib/constants";
import { Response401Error, ResponseKOError } from "@/lib/customErrors";
import { useQuery } from "@tanstack/react-query";
import LogoutTrigger from "../LogoutTrigger/LogoutTrigger";
import { setAccessTokenExpirationDate } from "@/lib/utils/authentication";

export const TOKEN_REFRESH_BUFFER_BEFORE_EXPIRATION = 60 * 60 * 1000; // i.e. 1 hour

const AccessTokenRefresher = () => {
  const checkShouldRefreshAccessToken = () => {
    if (typeof window === "undefined" || !window.localStorage) {
      return true;
    }

    const accessTokenExpirationDateString = localStorage.getItem(
      ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY,
    );

    if (!accessTokenExpirationDateString) {
      return true;
    }

    const accessTokenExpirationDateTime = new Date(
      accessTokenExpirationDateString,
    ).getTime();

    const isInvalidDate = isNaN(accessTokenExpirationDateTime);

    if (isInvalidDate) {
      return true;
    }

    const nowTime = new Date().getTime();

    return (
      nowTime + TOKEN_REFRESH_BUFFER_BEFORE_EXPIRATION >
      accessTokenExpirationDateTime
    );
  };

  const shouldRefreshAccessToken = checkShouldRefreshAccessToken();

  const fetchRefreshedAccessToken = async () => {
    const response = await fetch(API_ROUTE_REFRESH_TOKEN, {
      method: "POST",
    });

    if (response.status === 401) {
      throw new Response401Error();
    }

    if (!response.ok) {
      throw new ResponseKOError();
    }

    return response.json();
  };

  const {
    data: dataFetchRefreshedAccessToken,
    error: errorFetchRefreshedAccessToken,
    isPending: isPendingFetchRefreshedAccessToken,
    isError: isErrorFetchRefreshedAccessToken,
  } = useQuery({
    queryKey: ["fetchRefreshedAccessToken"],
    queryFn: fetchRefreshedAccessToken,
    retry: false,
    enabled: shouldRefreshAccessToken,
  });

  // Save refreshed access token expiration date to local storage:
  useEffect(() => {
    const accessTokenExpirationDate =
      dataFetchRefreshedAccessToken?.access_token_expiration_utc;

    if (accessTokenExpirationDate) {
      setAccessTokenExpirationDate(accessTokenExpirationDate);
    }
  }, [dataFetchRefreshedAccessToken]);

  // Log out in case of 401 response upon token refresh:
  if (
    isErrorFetchRefreshedAccessToken &&
    errorFetchRefreshedAccessToken instanceof Response401Error
  ) {
    return <LogoutTrigger />;
  }

  return null;
};

export default AccessTokenRefresher;

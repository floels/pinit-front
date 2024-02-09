"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAccountsContext } from "@/contexts/accountsContext";
import {
  API_ROUTE_OWNED_ACCOUNTS,
  API_ROUTE_REFRESH_TOKEN,
  ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY,
  ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY,
} from "@/lib/constants";
import { Response401Error, ResponseKOError } from "@/lib/customErrors";
import { AccountType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import LogoutTrigger from "../LogoutTrigger/LogoutTrigger";
import { getAccountsWithCamelCaseKeys } from "@/lib/utils/serializers";
import { setAccessTokenExpirationDate } from "@/lib/utils/authentication";

export const TOKEN_REFRESH_BUFFER_BEFORE_EXPIRATION = 60 * 60 * 1000; // i.e. 1 hour

const AuthenticatedSetupBuilder = () => {
  const {
    setAccounts,
    setIsFetchingAccounts,
    setIsErrorFetchingAccounts,
    setActiveAccountUsername,
  } = useAccountsContext();

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

  const fetchOwnedAccounts = async () => {
    const response = await fetch(API_ROUTE_OWNED_ACCOUNTS);

    if (!response.ok) {
      throw new ResponseKOError();
    }

    const responseData = await response.json();

    return getAccountsWithCamelCaseKeys(responseData.results);
  };

  const {
    data: ownedAccounts,
    isPending: isPendingFetchOwnedAccounts,
    isError: isErrorFetchOwnedAccounts,
  } = useQuery({
    queryKey: ["fetchOwnedAccounts"],
    queryFn: fetchOwnedAccounts,
    // Trigger query directly if no need to refresh the access token,
    // or if refresh token query completed (whether successful or not):
    enabled: !shouldRefreshAccessToken || !isPendingFetchRefreshedAccessToken,
    retry: false,
  });

  const setAndPersistActiveAccount = ({
    ownedAccounts,
  }: {
    ownedAccounts: AccountType[];
  }) => {
    const lastActiveAccountUsernameCookie = Cookies.get(
      ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY,
    );

    if (lastActiveAccountUsernameCookie) {
      const cookieMatchesOneAccount = ownedAccounts.some(
        (account) => account.username === lastActiveAccountUsernameCookie,
      );

      if (cookieMatchesOneAccount) {
        setActiveAccountUsername(lastActiveAccountUsernameCookie);

        return;
      }
    }

    // Either we don't have a cookie, or it doesn't match any account
    // By default, set the first account as the active account.
    if (ownedAccounts?.length) {
      const firstAccountUsername = ownedAccounts[0].username;

      setActiveAccountUsername(firstAccountUsername);

      Cookies.set(ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY, firstAccountUsername);
    }
  };

  // Save refreshed access token expiration date to local storage:
  useEffect(() => {
    const accessTokenExpirationDate =
      dataFetchRefreshedAccessToken?.access_token_expiration_utc;

    if (accessTokenExpirationDate) {
      setAccessTokenExpirationDate(accessTokenExpirationDate);
    }
  }, [dataFetchRefreshedAccessToken]);

  // Pass query statuses to the AccountsContext:
  useEffect(() => {
    if (isErrorFetchOwnedAccounts) {
      setIsFetchingAccounts(false);
      setIsErrorFetchingAccounts(true);
      return;
    }

    if (isPendingFetchOwnedAccounts) {
      setIsFetchingAccounts(true);
      setIsErrorFetchingAccounts(false);
      return;
    }

    // fetchOwnedAccounts query was successful:
    setIsFetchingAccounts(false);
    setIsErrorFetchingAccounts(false);

    setAccounts(ownedAccounts);
    setAndPersistActiveAccount({ ownedAccounts });
  }, [isErrorFetchOwnedAccounts, isPendingFetchOwnedAccounts, ownedAccounts]);

  // Log out in case of 401 response upon token refresh:
  if (
    isErrorFetchRefreshedAccessToken &&
    errorFetchRefreshedAccessToken instanceof Response401Error
  ) {
    return <LogoutTrigger />;
  }

  return null; // this component doesn't render anything
};

export default AuthenticatedSetupBuilder;

"use client";

import { useCallback, useEffect } from "react";
import Cookies from "js-cookie";
import { useAccountsContext } from "@/contexts/AccountsContext";
import {
  API_ROUTE_OWNED_ACCOUNTS,
  API_ROUTE_REFRESH_TOKEN,
  ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY,
} from "@/lib/constants";
import { Response401Error, ResponseKOError } from "@/lib/customErrors";
import { AccountType } from "@/lib/types";
import { getAccountsWithCamelizedKeys } from "@/lib/utils/adapters";
import { useQuery } from "@tanstack/react-query";
import LogoutTrigger from "../LogoutTrigger/LogoutTrigger";
import SpinnerBelowHeader from "../Spinners/SpinnerBelowHeader";

const AuthenticatedSetupBuilder = () => {
  const {
    setAccounts,
    setIsFetchingAccounts,
    setIsErrorFetchingAccounts,
    setActiveAccountUsername,
  } = useAccountsContext();

  const checkShouldRefreshAccessToken = () => {
    // TODO: implement this logic with local storage
    // In the meantime, systematically refresh the access token when the app boots
    return true;
  };

  const shouldRefreshAccessToken = checkShouldRefreshAccessToken();

  const fetchRefreshedAccessToken = async () => {
    const response = await fetch(API_ROUTE_REFRESH_TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      throw new Response401Error();
    }

    if (!response.ok) {
      throw new ResponseKOError();
    }

    return {}; // necessary, otherwise React Query doesn't change the query's status to "success"
  };

  const {
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

    if (response.status === 401) {
      throw new Response401Error();
    }

    if (!response.ok) {
      throw new ResponseKOError();
    }

    const responseData = await response.json();

    return getAccountsWithCamelizedKeys(responseData.results);
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

  const setAndPersistActiveAccount = useCallback(
    ({ ownedAccounts }: { ownedAccounts: AccountType[] }) => {
      if (!ownedAccounts?.length) {
        return;
      }

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
      const firstAccountUsername = ownedAccounts[0].username;

      setActiveAccountUsername(firstAccountUsername);

      Cookies.set(ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY, firstAccountUsername);

      return;
    },
    [setActiveAccountUsername],
  );

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
  }, [
    isErrorFetchOwnedAccounts,
    setIsFetchingAccounts,
    setIsErrorFetchingAccounts,
    isPendingFetchOwnedAccounts,
    setAccounts,
    ownedAccounts,
    setAndPersistActiveAccount,
  ]);

  // Log out in case of 401 response upon token refresh:
  if (
    isErrorFetchRefreshedAccessToken &&
    errorFetchRefreshedAccessToken instanceof Response401Error
  ) {
    return (
      <LogoutTrigger>
        <SpinnerBelowHeader />
      </LogoutTrigger>
    );
  }

  return null; // this component doesn't render anything
};

export default AuthenticatedSetupBuilder;

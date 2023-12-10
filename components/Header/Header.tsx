"use client";

import { API_ROUTE_OWNED_ACCOUNTS } from "@/lib/constants";
import { AccountType } from "@/lib/types";
import { getAccountsWithCamelizedKeys } from "@/lib/utils/adapters";
import { useCallback, useEffect, useState } from "react";
import HeaderAuthenticated from "./HeaderAuthenticated";
import HeaderUnauthenticated from "./HeaderUnauthenticated";

type HeaderProps = {
  withAccessTokenCookie?: boolean;
};

const Header = ({ withAccessTokenCookie }: HeaderProps) => {
  const [isFetching, setIsFetching] = useState(withAccessTokenCookie);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [ownedAccounts, setOwnedAccounts] = useState<AccountType[]>([]);

  const fetchOwnedAccounts = useCallback(async () => {
    let response;

    try {
      response = await fetch(API_ROUTE_OWNED_ACCOUNTS, {
        method: "GET",
      });
    } catch (error) {
      setFetchFailed(true);
      return;
    } finally {
      setIsFetching(false);
    }

    if (!response.ok) {
      setFetchFailed(true);
      return;
    }

    const { results } = await response.json();

    if (!results || !results?.length) {
      setFetchFailed(true);
      return;
    }

    setOwnedAccounts(getAccountsWithCamelizedKeys(results));
  }, []);

  useEffect(() => {
    if (withAccessTokenCookie) {
      fetchOwnedAccounts();
    }
  }, [withAccessTokenCookie, fetchOwnedAccounts]);

  if (!withAccessTokenCookie) {
    return <HeaderUnauthenticated />;
  }

  if (isFetching) {
    // TODO: add loading state to <HeaderAuthenticated />
    return <HeaderAuthenticated />;
  }

  if (fetchFailed) {
    // TODO: add error message to <HeaderAuthenticated />
    return <HeaderAuthenticated />;
  }

  // TODO: display fetched information in <HeaderAuthenticated />
  return <HeaderAuthenticated />;
};

export default Header;

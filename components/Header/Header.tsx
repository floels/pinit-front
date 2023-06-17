import humps from "humps";
import { cookies } from "next/headers";
import HeaderAuthenticatedServer from "./HeaderAuthenticatedServer";
import {
  ENDPOINT_GET_ACCOUNTS,
  ERROR_CODE_INVALID_ACCESS_TOKEN,
} from "@/lib/constants";
import { fetchWithAuthentication } from "@/lib/utils/fetch";
import AccessTokenRefresher from "../AccessTokenRefresher/AccessTokenRefresher";

export type AccountType = {
  type: "personal" | "business";
  username: string;
  displayName: string;
  initial: string;
  ownerEmail: string;
};

const fetchAccounts = async (accessToken: string) => {
  let accountsResponse, errorCode;

  try {
    accountsResponse = await fetchWithAuthentication({
      endpoint: ENDPOINT_GET_ACCOUNTS,
      accessToken,
    });
  } catch (error) {
    errorCode = (error as Error).message;
  }

  let accounts;

  if (accountsResponse) {
    accounts = humps.camelizeKeys(accountsResponse.results) as AccountType[];
  }

  return { accounts, errorCode };
};

const Header = async () => {
  const accessTokenCookie = cookies().get("accessToken");

  if (accessTokenCookie) {
    const { accounts, errorCode } = await fetchAccounts(
      accessTokenCookie.value
    );

    if (errorCode === ERROR_CODE_INVALID_ACCESS_TOKEN) {
      return <AccessTokenRefresher />;
    }

    return (
      <HeaderAuthenticatedServer
        accounts={accounts}
        errorCode={errorCode}
      />
    );
  }

  // No access token: we are not unauthenticated.
  // NB: <HeaderUnauthenticated /> will be rendered by <HomePageUnauthenticated /> (more convenient to have both in the same component to handle scrolling effect)
  return null;
};

export default Header;

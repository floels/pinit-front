import humps from "humps";
import { cookies } from "next/headers";
import HeaderAuthenticatedServer from "./HeaderAuthenticatedServer";
import { ENDPOINT_GET_ACCOUNTS } from "@/lib/constants";
import { fetchWithAuthentication } from "@/lib/utils/fetch";
import AccessTokenRefresher from "../AccessTokenRefresher/AccessTokenRefresher";

export type AccountType = {
  type: "personal" | "business";
  username: string;
  displayName: string;
  initial: string;
  ownerEmail: string;
};

const Header = async () => {
  const accessTokenCookie = cookies().get("accessToken");

  if (accessTokenCookie) {
    const accessToken = accessTokenCookie.value;

    const accountsResponse = await fetchWithAuthentication({
      endpoint: ENDPOINT_GET_ACCOUNTS,
      accessToken,
    });

    let accounts;

    if (accountsResponse.ok) {
      const accountsResponseData = await accountsResponse.json();
  
      accounts = humps.camelizeKeys(accountsResponseData.results) as AccountType[];

      return <HeaderAuthenticatedServer accounts={accounts} />;
    }
    
    if (accountsResponse.status === 401) {
      return <AccessTokenRefresher />;
    }

    throw new Error("Unexpected response status received when calling GET /accounts/");
  }

  // No access token: we are not unauthenticated.
  // NB: <HeaderUnauthenticated /> will be rendered by <HomePageUnauthenticated /> (more convenient to have both in the same component to handle scrolling effect)
  return null;
};

export default Header;

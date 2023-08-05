import humps from "humps";
import { cookies } from "next/headers";
import HomePageUnauthenticatedServer from "@/components/HomePageUnauthenticated/HomePageUnauthenticatedServer";
import HomePageAuthenticatedServer from "@/components/HomePageAuthenticated/HomePageAuthenticatedServer";
import {
  ENDPOINT_GET_ACCOUNTS,
  ENDPOINT_GET_PIN_SUGGESTIONS,
  ERROR_CODE_FETCH_FAILED,
  ERROR_CODE_UNEXPECTED_SERVER_RESPONSE,
} from "@/lib/constants";
import { fetchWithAuthentication } from "@/lib/utils/fetch";
import AccessTokenRefresher from "@/components/AccessTokenRefresher/AccessTokenRefresher";

export enum TypesOfAccount {
  PERSONAL = "personal",
  BUSINESS = "business",
}

export type AccountType = {
  type: TypesOfAccount;
  username: string;
  displayName: string;
  initial: string;
  ownerEmail: string;
};

// Data fetching design implemented below was inspired by:
// https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#parallel-data-fetching

const fetchData = async (accessToken: string) => {
  const [fetchAccountsResponse, fetchInitialPinSuggestionsResponse] =
    await Promise.all([
      fetchAccounts(accessToken),
      fetchInitialPinSuggestions(accessToken),
    ]);

  const [fetchAccountsData, fetchInitialPinSuggestionsData] = await Promise.all(
    [fetchAccountsResponse.json(), fetchInitialPinSuggestionsResponse.json()],
  );

  return {
    fetchAccountsResponse,
    fetchInitialPinSuggestionsResponse,
    fetchAccountsData,
    fetchInitialPinSuggestionsData,
  };
};

const fetchAccounts = async (accessToken: string) => {
  return fetchWithAuthentication({
    endpoint: ENDPOINT_GET_ACCOUNTS,
    accessToken,
  });
};

const fetchInitialPinSuggestions = async (accessToken: string) => {
  return fetchWithAuthentication({
    endpoint: ENDPOINT_GET_PIN_SUGGESTIONS,
    accessToken,
  });
};

const getAccountsWithCamelizedKeys = (fetchAccountsData: any) => {
  return humps.camelizeKeys(fetchAccountsData.results) as AccountType[];
};

const getPinSuggestionsWithCamelizedKeys = (fetchInitialPinSuggestionsData: {
  results: any[];
}) => {
  return fetchInitialPinSuggestionsData.results.map((pinSuggestion) => ({
    id: pinSuggestion.id,
    imageURL: pinSuggestion.image_url,
    title: pinSuggestion.title,
    description: pinSuggestion.description,
    authorUsername: pinSuggestion.author.user_name,
    authorDisplayName: pinSuggestion.author.display_name,
  }));
};

const HomePage = async () => {
  const accessTokenCookie = cookies().get("accessToken");

  if (!accessTokenCookie) {
    return <HomePageUnauthenticatedServer />;
  }

  const accessToken = accessTokenCookie.value;

  try {
    const {
      fetchAccountsResponse,
      fetchInitialPinSuggestionsResponse,
      fetchAccountsData,
      fetchInitialPinSuggestionsData,
    } = await fetchData(accessToken);

    if (fetchAccountsResponse.ok && fetchInitialPinSuggestionsResponse.ok) {
      const accounts = getAccountsWithCamelizedKeys(fetchAccountsData);
      const initialPinSuggestions = getPinSuggestionsWithCamelizedKeys(
        fetchInitialPinSuggestionsData,
      );

      return (
        <HomePageAuthenticatedServer
          accounts={accounts}
          initialPinSuggestions={initialPinSuggestions}
        />
      );
    }

    if (
      fetchAccountsResponse.status === 401 ||
      fetchInitialPinSuggestionsResponse.status === 401
    ) {
      // Access token is likely expired
      return <AccessTokenRefresher />;
    }

    // Unexpected server response: by default, return unauthenticated homepage
    return (
      <HomePageUnauthenticatedServer
        errorCode={ERROR_CODE_UNEXPECTED_SERVER_RESPONSE}
      />
    );
  } catch (error) {
    return (
      <HomePageUnauthenticatedServer errorCode={ERROR_CODE_FETCH_FAILED} />
    );
  }
};

export default HomePage;

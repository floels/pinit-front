import LandingPage from "@/components/LandingPageContent/LandingPageContent";
import PinsBoard from "@/components/PinsBoard/PinsBoard";
import { cookies } from "next/headers";
import { fetchWithAuthentication } from "@/lib/utils/fetch";
import {
  API_ROUTE_PINS_SUGGESTIONS,
  API_ENDPOINT_GET_PIN_SUGGESTIONS,
  ERROR_CODE_FETCH_BACKEND_FAILED,
  ERROR_CODE_UNEXPECTED_SERVER_RESPONSE,
} from "@/lib/constants";
import { getPinsWithCamelizedKeys } from "@/lib/utils/adapters";
import AccessTokenRefresher from "@/components/AccessTokenRefresher/AccessTokenRefresher";

export const getPinsFetcherAndRenderer = ({
  fetchPinsAPIRoute,
  fetchPinsAPIEndpoint,
}: {
  fetchPinsAPIRoute: string;
  fetchPinsAPIEndpoint: string;
}) => {
  return async (accessToken: string) => {
    let fetchResponse;

    try {
      fetchResponse = await fetchWithAuthentication({
        endpoint: `${fetchPinsAPIEndpoint}/`,
        accessToken,
      });
    } catch (error) {
      return (
        <PinsBoard
          initialPins={[]}
          fetchPinsAPIRoute={fetchPinsAPIRoute}
          errorCode={ERROR_CODE_FETCH_BACKEND_FAILED}
        />
      );
    }

    if (fetchResponse.status === 401) {
      // Access token is likely expired:
      return <AccessTokenRefresher />;
    }

    if (!fetchResponse.ok) {
      return (
        <PinsBoard
          initialPins={[]}
          fetchPinsAPIRoute={fetchPinsAPIRoute}
          errorCode={ERROR_CODE_UNEXPECTED_SERVER_RESPONSE}
        />
      );
    }

    try {
      const fetchResponseData = await fetchResponse.json();

      const fetchedPins = fetchResponseData.results;

      const initialPins = getPinsWithCamelizedKeys(fetchedPins);

      return (
        <PinsBoard
          initialPins={initialPins}
          fetchPinsAPIRoute={fetchPinsAPIRoute}
        />
      );
    } catch (error) {
      // Malformed response
      return (
        <PinsBoard
          initialPins={[]}
          fetchPinsAPIRoute={fetchPinsAPIRoute}
          errorCode={ERROR_CODE_UNEXPECTED_SERVER_RESPONSE}
        />
      );
    }
  };
};

const Page = async () => {
  const accessTokenCookie = cookies().get("accessToken");

  if (!accessTokenCookie) {
    return <LandingPage />;
  }

  const accessToken = accessTokenCookie.value;

  const pinSuggestionsFetcherAndRenderer = getPinsFetcherAndRenderer({
    fetchPinsAPIRoute: API_ROUTE_PINS_SUGGESTIONS,
    fetchPinsAPIEndpoint: API_ENDPOINT_GET_PIN_SUGGESTIONS,
  });

  // TODO: refactor (unclear)
  const renderedComponent = await pinSuggestionsFetcherAndRenderer(accessToken);

  return renderedComponent;
};

export default Page;

import LandingPageServer from "@/components/LandingPage/LandingPageServer";
import PinsBoardServer from "@/components/PinsBoard/PinsBoardServer";
import { cookies } from "next/headers";
import { fetchWithAuthentication } from "@/lib/utils/fetch";
import {
  API_ROUTE_PINS_SUGGESTIONS,
  API_ENDPOINT_GET_PIN_SUGGESTIONS,
  ERROR_CODE_FETCH_BACKEND_FAILED,
  ERROR_CODE_UNEXPECTED_SERVER_RESPONSE,
} from "@/lib/constants";
import { getPinsWithCamelizedKeys } from "@/lib/utils/misc";
import AccessTokenRefresherServer from "@/components/AccessTokenRefresher/AccessTokenRefresherServer";

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
        <PinsBoardServer
          initialPins={[]}
          fetchPinsAPIRoute={fetchPinsAPIRoute}
          errorCode={ERROR_CODE_FETCH_BACKEND_FAILED}
        />
      );
    }

    if (fetchResponse.status === 401) {
      // Access token is likely expired:
      return <AccessTokenRefresherServer />;
    }

    if (!fetchResponse.ok) {
      return (
        <PinsBoardServer
          initialPins={[]}
          fetchPinsAPIRoute={fetchPinsAPIRoute}
          errorCode={ERROR_CODE_UNEXPECTED_SERVER_RESPONSE}
        />
      );
    }

    try {
      const fetchResponseData = await fetchResponse.json();

      const initialPins = getPinsWithCamelizedKeys(fetchResponseData);

      return (
        <PinsBoardServer
          initialPins={initialPins}
          fetchPinsAPIRoute={fetchPinsAPIRoute}
        />
      );
    } catch (error) {
      // Malformed response
      return (
        <PinsBoardServer
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
    return <LandingPageServer />;
  }

  const accessToken = accessTokenCookie.value;

  const pinSuggestionsFetcherAndRenderer = getPinsFetcherAndRenderer({
    fetchPinsAPIRoute: API_ROUTE_PINS_SUGGESTIONS,
    fetchPinsAPIEndpoint: API_ENDPOINT_GET_PIN_SUGGESTIONS,
  });

  const renderedComponent = await pinSuggestionsFetcherAndRenderer(accessToken);

  return renderedComponent;
};

export default Page;

import LandingPageServer from "@/components/LandingPage/LandingPageServer";
import PinsBoardServer from "@/components/PinsBoard/PinsBoardServer";
import { cookies } from "next/headers";
import { fetchWithAuthentication } from "@/lib/utils/fetch";
import {
  ENDPOINT_GET_PIN_SUGGESTIONS,
  ERROR_CODE_FETCH_BACKEND_FAILED,
  ERROR_CODE_UNEXPECTED_SERVER_RESPONSE,
} from "@/lib/constants";
import { getPinThumbnailsWithCamelizedKeys } from "@/lib/utils/misc";
import AccessTokenRefresherServer from "@/components/AccessTokenRefresher/AccessTokenRefresherServer";

export const getPinThumbnailsFetcherAndRenderer = (
  fetchThumbnailsAPIRoute: string,
  fetchThumbnailsAPIEndpoint: string,
) => {
  return async (accessToken: string) => {
    let fetchResponse;

    try {
      fetchResponse = await fetchWithAuthentication({
        endpoint: fetchThumbnailsAPIEndpoint,
        accessToken,
      });
    } catch (error) {
      return (
        <PinsBoardServer
          initialPinThumbnails={[]}
          fetchThumbnailsAPIRoute={fetchThumbnailsAPIRoute}
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
          initialPinThumbnails={[]}
          fetchThumbnailsAPIRoute={fetchThumbnailsAPIRoute}
          errorCode={ERROR_CODE_UNEXPECTED_SERVER_RESPONSE}
        />
      );
    }

    try {
      const fetchResponseData = await fetchResponse.json();

      const initialPinThumbnails =
        getPinThumbnailsWithCamelizedKeys(fetchResponseData);

      return (
        <PinsBoardServer
          initialPinThumbnails={initialPinThumbnails}
          fetchThumbnailsAPIRoute={fetchThumbnailsAPIRoute}
        />
      );
    } catch (error) {
      // Malformed response
      return (
        <PinsBoardServer
          initialPinThumbnails={[]}
          fetchThumbnailsAPIRoute={fetchThumbnailsAPIRoute}
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

  const pinSuggestionsFetcherAndRenderer = getPinThumbnailsFetcherAndRenderer(
    "/api/pins/suggestions",
    ENDPOINT_GET_PIN_SUGGESTIONS,
  );

  const renderedComponent = await pinSuggestionsFetcherAndRenderer(accessToken);

  return renderedComponent;
};

export default Page;

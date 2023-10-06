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

const Page = async () => {
  const accessTokenCookie = cookies().get("accessToken");

  if (!accessTokenCookie) {
    return <LandingPageServer />;
  }

  const accessToken = accessTokenCookie.value;

  let fetchPinSuggestionsResponse;

  try {
    fetchPinSuggestionsResponse = await fetchWithAuthentication({
      endpoint: ENDPOINT_GET_PIN_SUGGESTIONS,
      accessToken,
    });
  } catch (error) {
    return (
      <PinsBoardServer
        initialPinThumbnails={[]}
        errorCode={ERROR_CODE_FETCH_BACKEND_FAILED}
      />
    );
  }

  if (fetchPinSuggestionsResponse.status === 401) {
    // Access token is likely expired:
    return <AccessTokenRefresherServer />;
  }

  if (!fetchPinSuggestionsResponse.ok) {
    return (
      <PinsBoardServer
        initialPinThumbnails={[]}
        errorCode={ERROR_CODE_UNEXPECTED_SERVER_RESPONSE}
      />
    );
  }

  try {
    const fetchPinSuggestionsResponseData =
      await fetchPinSuggestionsResponse.json();

    const initialPinSuggestions = getPinThumbnailsWithCamelizedKeys(
      fetchPinSuggestionsResponseData,
    );

    return <PinsBoardServer initialPinThumbnails={initialPinSuggestions} />;
  } catch (error) {
    // Malformed response
    return (
      <PinsBoardServer
        initialPinThumbnails={[]}
        errorCode={ERROR_CODE_UNEXPECTED_SERVER_RESPONSE}
      />
    );
  }
};

export default Page;

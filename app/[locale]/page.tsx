import LandingPageContentServer from "@/components/LandingPage/LandingPageContentServer";
import HomePageContentServer from "@/components/HomePage/HomePageContentServer";
import { cookies } from "next/headers";
import { fetchWithAuthentication } from "@/lib/utils/fetch";
import {
  ENDPOINT_GET_PIN_SUGGESTIONS,
  ERROR_CODE_FETCH_BACKEND_FAILED,
  ERROR_CODE_UNEXPECTED_SERVER_RESPONSE,
} from "@/lib/constants";
import { getPinSuggestionsWithCamelizedKeys } from "@/lib/utils/misc";
import AccessTokenRefresherServer from "@/components/AccessTokenRefresher/AccessTokenRefresherServer";

const Page = async () => {
  const accessTokenCookie = cookies().get("accessToken");

  if (!accessTokenCookie) {
    return <LandingPageContentServer />;
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
      <HomePageContentServer
        initialPinSuggestions={[]}
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
      <HomePageContentServer
        initialPinSuggestions={[]}
        errorCode={ERROR_CODE_UNEXPECTED_SERVER_RESPONSE}
      />
    );
  }

  try {
    const fetchPinSuggestionsResponseData =
      await fetchPinSuggestionsResponse.json();

    const initialPinSuggestions = getPinSuggestionsWithCamelizedKeys(
      fetchPinSuggestionsResponseData,
    );

    return (
      <HomePageContentServer initialPinSuggestions={initialPinSuggestions} />
    );
  } catch (error) {
    // Malformed response
    return (
      <HomePageContentServer
        initialPinSuggestions={[]}
        errorCode={ERROR_CODE_UNEXPECTED_SERVER_RESPONSE}
      />
    );
  }
};

export default Page;

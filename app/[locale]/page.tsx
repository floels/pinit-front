import { cookies } from "next/headers";
import LandingPageContent from "@/components/LandingPageContent/LandingPageContent";
import PinsBoard from "@/components/PinsBoard/PinsBoard";
import { fetchWithAuthentication } from "@/lib/utils/fetch";
import {
  API_ROUTE_PINS_SUGGESTIONS,
  API_ENDPOINT_GET_PIN_SUGGESTIONS,
  ERROR_CODE_FETCH_BACKEND_FAILED,
  ERROR_CODE_UNEXPECTED_SERVER_RESPONSE,
} from "@/lib/constants";
import { getPinsWithCamelizedKeys } from "@/lib/utils/adapters";
import AccessTokenRefresher from "@/components/AccessTokenRefresher/AccessTokenRefresher";
import {
  MalformedResponseError,
  NetworkError,
  Response401Error,
  ResponseKOError,
} from "@/lib/customErrors";

const fetchInitialPinSuggestions = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  let response;

  try {
    response = await fetchWithAuthentication({
      endpoint: `${API_ENDPOINT_GET_PIN_SUGGESTIONS}/`,
      accessToken,
    });
  } catch (error) {
    throw new NetworkError();
  }

  if (response.status === 401) {
    throw new Response401Error();
  }

  if (!response.ok) {
    throw new ResponseKOError();
  }

  let responseData;

  try {
    responseData = await response.json();
  } catch (error) {
    throw new MalformedResponseError();
  }

  const { results } = responseData;

  if (!results || !results?.length) {
    throw new MalformedResponseError();
  }

  const initialPinSuggestions = getPinsWithCamelizedKeys(results);

  return initialPinSuggestions;
};

const Page = async () => {
  const accessTokenCookie = cookies().get("accessToken");

  if (!accessTokenCookie) {
    return <LandingPageContent />;
  }

  const accessToken = accessTokenCookie.value;

  let initialPinSuggestions;

  try {
    initialPinSuggestions = await fetchInitialPinSuggestions({
      accessToken,
    });
  } catch (error) {
    if (error instanceof Response401Error) {
      // Access token is likely expired:
      return <AccessTokenRefresher />;
    }

    if (error instanceof NetworkError) {
      return (
        <PinsBoard
          initialPins={[]}
          fetchPinsAPIRoute={API_ROUTE_PINS_SUGGESTIONS}
          errorCode={ERROR_CODE_FETCH_BACKEND_FAILED}
        />
      );
    }

    return (
      <PinsBoard
        initialPins={[]}
        fetchPinsAPIRoute={API_ROUTE_PINS_SUGGESTIONS}
        errorCode={ERROR_CODE_UNEXPECTED_SERVER_RESPONSE}
      />
    );
  }

  return (
    <PinsBoard
      initialPins={initialPinSuggestions}
      fetchPinsAPIRoute={API_ROUTE_PINS_SUGGESTIONS}
    />
  );
};

export default Page;

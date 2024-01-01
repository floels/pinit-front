import { cookies } from "next/headers";
import LandingPageContent from "@/components/LandingPageContent/LandingPageContent";
import PinsBoardContainer from "@/components/PinsBoard/PinsBoardContainer";
import { fetchWithAuthentication } from "@/lib/utils/fetch";
import {
  API_ROUTE_PINS_SUGGESTIONS,
  API_ENDPOINT_GET_PIN_SUGGESTIONS,
  ACCESS_TOKEN_COOKIE_KEY,
} from "@/lib/constants";
import { getPinsWithCamelCaseKeys } from "@/lib/utils/adapters";
import {
  MalformedResponseError,
  Response401Error,
  ResponseKOError,
} from "@/lib/customErrors";
import ErrorView from "@/components/ErrorView/ErrorView";
import LogoutTrigger from "@/components/LogoutTrigger/LogoutTrigger";

const fetchInitialPinSuggestions = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  const response = await fetchWithAuthentication({
    endpoint: `${API_ENDPOINT_GET_PIN_SUGGESTIONS}/`,
    accessToken,
  });

  if (response.status === 401) {
    throw new Response401Error();
  }

  if (!response.ok) {
    throw new ResponseKOError();
  }

  const { results } = await response.json();

  if (!results || !results?.length) {
    throw new MalformedResponseError();
  }

  const initialPinSuggestions = getPinsWithCamelCaseKeys(results);

  return initialPinSuggestions;
};

const Page = async () => {
  const accessTokenCookie = cookies().get(ACCESS_TOKEN_COOKIE_KEY);

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
      return <LogoutTrigger />;
    }

    return (
      <ErrorView errorMessageKey="HomePageContent.ERROR_FETCH_PIN_SUGGESTIONS" />
    );
  }

  return (
    <PinsBoardContainer
      initialPins={initialPinSuggestions}
      fetchPinsAPIRoute={API_ROUTE_PINS_SUGGESTIONS}
    />
  );
};

export default Page;

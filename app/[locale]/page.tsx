import { cookies } from "next/headers";
import HomePageUnauthenticatedServer from "@/components/HomePage/HomePageUnauthenticatedServer";
import HomePageAuthenticatedServer from "@/components/HomePage/HomePageAuthenticatedServer";
import { ENDPOINT_GET_PIN_SUGGESTIONS } from "@/lib/constants";
import { fetchWithAuthentication } from "@/lib/utils/fetch";

const fetchInitialPinSuggestions = async (accessToken: string) => {
  let pinSuggestionsResponse;

  // TODO: handle fetch fail
  pinSuggestionsResponse = await fetchWithAuthentication({
    endpoint: ENDPOINT_GET_PIN_SUGGESTIONS,
    accessToken,
  });

  if (pinSuggestionsResponse.ok) {
    const pinSuggestionsResponseData = await pinSuggestionsResponse.json();

    return getPinSuggestionsWithCamelizedKeys(pinSuggestionsResponseData);
  }

  return [];
};

const getPinSuggestionsWithCamelizedKeys = (pinSuggestionsResponseData: { results: any[] }) => {
  return pinSuggestionsResponseData.results.map((pinSuggestion) => ({
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

  if (accessTokenCookie) {
    const initialPinSuggestions = await fetchInitialPinSuggestions(accessTokenCookie.value);
    
    return <HomePageAuthenticatedServer initialPinSuggestions={initialPinSuggestions} />;
  }

  return <HomePageUnauthenticatedServer />;
};

export default HomePage;

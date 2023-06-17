import { cookies } from "next/headers";
import HomePageUnauthenticatedServer from "@/components/HomePage/HomePageUnauthenticatedServer";
import HomePageAuthenticatedServer from "@/components/HomePage/HomePageAuthenticatedServer";
import { ENDPOINT_GET_PIN_SUGGESTIONS } from "@/lib/constants";
import { fetchWithAuthentication } from "@/lib/utils/fetch";

const fetchInitialPinSuggestions = async (accessToken: string) => {
  let pinSuggestionsResponse;

  try {
    pinSuggestionsResponse = await fetchWithAuthentication({
      endpoint: ENDPOINT_GET_PIN_SUGGESTIONS,
      accessToken,
    });
  } catch (error) {
    // TODO: handle error case
  }

  if (pinSuggestionsResponse) {
    return getPinSuggestionsWithCamelizedKeys(pinSuggestionsResponse);
  }

  return [];
};

const getPinSuggestionsWithCamelizedKeys = (pinSuggestionsResponse: { results: any[] }) => {
  return pinSuggestionsResponse.results.map((pinSuggestion) => ({
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

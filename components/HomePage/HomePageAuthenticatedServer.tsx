import HomePageAuthenticatedClient from "./HomePageAuthenticatedClient";

type HomePageAuthenticatedServerProps = {
    accessToken: string;
};

const fetchPinSuggestions = async (accessToken: string) => {
    // TODO: implement data fetching
    return {};
  };

const HomePageAuthenticatedServer = async ({ accessToken }: HomePageAuthenticatedServerProps) => {
    const pinSuggestions = await fetchPinSuggestions(accessToken);

    return <HomePageAuthenticatedClient pinSuggestions={pinSuggestions} />;
};

export default HomePageAuthenticatedServer;

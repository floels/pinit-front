import { redirect } from "next/navigation";
import {
  API_ROUTE_PINS_SEARCH,
  API_ENDPOINT_SEARCH_PINS,
  API_BASE_URL,
  ERROR_CODE_FETCH_BACKEND_FAILED,
  ERROR_CODE_UNEXPECTED_SERVER_RESPONSE,
} from "@/lib/constants";
import { NetworkError, ResponseKOError } from "@/lib/customErrors";
import PinsBoard from "@/components/PinsBoard/PinsBoard";

type PageProps = {
  searchParams: { q: string };
};

const fetchInitialSearchResults = async ({
  searchTerm,
}: {
  searchTerm: string;
}) => {
  let fetchResponse;

  try {
    fetchResponse = await fetch(
      `${API_BASE_URL}/${API_ENDPOINT_SEARCH_PINS}/?q=${searchTerm}`,
    );
  } catch (error) {
    throw new NetworkError();
  }

  if (!fetchResponse.ok) {
    throw new ResponseKOError();
  }

  const fetchResponseData = await fetchResponse.json();

  const initialSearchResults = fetchResponseData.results;

  return initialSearchResults;
};

const Page = async ({ searchParams }: PageProps) => {
  const searchTerm = searchParams.q;

  if (!searchTerm) {
    redirect("/");
  }

  let initialSearchResults;

  try {
    initialSearchResults = await fetchInitialSearchResults({
      searchTerm,
    });
  } catch (error) {
    if (error instanceof NetworkError) {
      return (
        <PinsBoard
          initialPins={[]}
          fetchPinsAPIRoute={API_ROUTE_PINS_SEARCH}
          errorCode={ERROR_CODE_FETCH_BACKEND_FAILED}
        />
      );
    }

    return (
      <PinsBoard
        initialPins={[]}
        fetchPinsAPIRoute={API_ROUTE_PINS_SEARCH}
        errorCode={ERROR_CODE_UNEXPECTED_SERVER_RESPONSE}
      />
    );
  }

  return (
    <PinsBoard
      initialPins={initialSearchResults}
      fetchPinsAPIRoute={API_ROUTE_PINS_SEARCH}
    />
  );
};

export default Page;

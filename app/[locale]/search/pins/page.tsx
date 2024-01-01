import { redirect } from "next/navigation";
import {
  API_ROUTE_PINS_SEARCH,
  API_ENDPOINT_SEARCH_PINS,
  API_BASE_URL,
  ERROR_CODE_FETCH_BACKEND_FAILED,
  ERROR_CODE_UNEXPECTED_SERVER_RESPONSE,
} from "@/lib/constants";
import { NetworkError, ResponseKOError } from "@/lib/customErrors";
import PinsBoardContainer from "@/components/PinsBoard/PinsBoardContainer";

type PageProps = {
  searchParams: { q: string };
};

const fetchInitialSearchResults = async ({
  searchTerm,
}: {
  searchTerm: string;
}) => {
  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}/${API_ENDPOINT_SEARCH_PINS}/?q=${searchTerm}`,
    );
  } catch (error) {
    throw new NetworkError();
  }

  if (!response.ok) {
    throw new ResponseKOError();
  }

  const responseData = await response.json();

  return responseData.results;
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
        <PinsBoardContainer
          initialPins={[]}
          fetchPinsAPIRoute={API_ROUTE_PINS_SEARCH}
          errorCode={ERROR_CODE_FETCH_BACKEND_FAILED}
        />
      );
    }

    return (
      <PinsBoardContainer
        initialPins={[]}
        fetchPinsAPIRoute={API_ROUTE_PINS_SEARCH}
        errorCode={ERROR_CODE_UNEXPECTED_SERVER_RESPONSE}
      />
    );
  }

  return (
    <PinsBoardContainer
      initialPins={initialSearchResults}
      fetchPinsAPIRoute={API_ROUTE_PINS_SEARCH}
    />
  );
};

export default Page;

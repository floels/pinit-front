import { redirect } from "next/navigation";
import {
  API_ROUTE_PINS_SEARCH,
  API_ENDPOINT_SEARCH_PINS,
  API_BASE_URL,
} from "@/lib/constants";
import { ResponseKOError } from "@/lib/customErrors";
import PinsBoardContainer from "@/components/PinsBoard/PinsBoardContainer";
import ErrorView from "@/components/ErrorView/ErrorView";

type PageProps = {
  searchParams: { q: string };
};

const fetchInitialSearchResults = async ({
  searchTerm,
}: {
  searchTerm: string;
}) => {
  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINT_SEARCH_PINS}/?q=${searchTerm}`,
  );

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
    return (
      <ErrorView errorMessageKey="PinsSearch.ERROR_FETCH_SEARCH_RESULTS" />
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

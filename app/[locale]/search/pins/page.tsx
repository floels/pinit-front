import { redirect } from "next/navigation";
import {
  API_ROUTE_SEARCH,
  API_ENDPOINT_SEARCH_PINS,
  API_BASE_URL,
} from "@/lib/constants";
import { ResponseKOError } from "@/lib/customErrors";
import PinsBoardContainer from "@/components/PinsBoard/PinsBoardContainer";
import ErrorView from "@/components/ErrorView/ErrorView";
import { getPinsWithCamelCaseKeys } from "@/lib/utils/serializers";

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

  const initialSearchResults = getPinsWithCamelCaseKeys(responseData.results);

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
  } catch {
    return (
      <ErrorView errorMessageKey="PinsSearch.ERROR_FETCH_SEARCH_RESULTS" />
    );
  }

  return (
    <PinsBoardContainer
      initialPins={initialSearchResults}
      fetchPinsAPIRoute={API_ROUTE_SEARCH}
      emptyResultsMessageKey="PinsSearch.NO_RESULTS"
    />
  );
};

export default Page;

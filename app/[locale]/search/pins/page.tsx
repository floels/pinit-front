import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPinThumbnailsFetcherAndRenderer } from "../../page";
import {
  API_ROUTE_PINS_SEARCH,
  API_ENDPOINT_SEARCH_PINS,
} from "@/lib/constants";

type PageProps = {
  searchParams: { q: string };
};

const Page = async ({ searchParams }: PageProps) => {
  const accessTokenCookie = cookies().get("accessToken");

  if (!accessTokenCookie || !searchParams.q) {
    redirect("/");
  }

  const accessToken = accessTokenCookie.value;

  const pinSuggestionsFetcherAndRenderer = getPinThumbnailsFetcherAndRenderer({
    fetchThumbnailsAPIRoute: `${API_ROUTE_PINS_SEARCH}?q=${searchParams.q}`,
    fetchThumbnailsAPIEndpoint: `${API_ENDPOINT_SEARCH_PINS}/?q=${searchParams.q}`,
  });

  const renderedComponent = await pinSuggestionsFetcherAndRenderer(accessToken);

  return renderedComponent;
};

export default Page;

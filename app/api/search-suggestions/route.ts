import { NextRequest, NextResponse } from "next/server";
import {
  API_BASE_URL,
  API_ENDPOINT_SEARCH_SUGGESTIONS,
  ERROR_CODE_FETCH_BACKEND_FAILED,
} from "@/lib/constants";

export const GET = async (request: NextRequest) => {
  // See https://nextjs.org/docs/app/building-your-application/routing/route-handlers#url-query-parameters
  const queryParams = request.nextUrl.searchParams;
  const search = queryParams.get("search");

  let backendResponse;

  try {
    backendResponse = await fetch(
      `${API_BASE_URL}/${API_ENDPOINT_SEARCH_SUGGESTIONS}/?search=${search}`,
    );
  } catch {
    return new NextResponse(
      JSON.stringify({ errors: [ERROR_CODE_FETCH_BACKEND_FAILED] }),
      { status: 500 },
    );
  }

  return backendResponse;
};

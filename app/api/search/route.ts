import { NextRequest, NextResponse } from "next/server";
import {
  API_ENDPOINT_SEARCH_PINS,
  ERROR_CODE_FETCH_BACKEND_FAILED,
} from "@/lib/constants";

export const GET = async (request: NextRequest) => {
  // See https://nextjs.org/docs/app/building-your-application/routing/route-handlers#url-query-parameters
  const queryParams = request.nextUrl.searchParams;
  const page = queryParams.get("page");
  const q = queryParams.get("q");

  let backendResponse;

  try {
    backendResponse = await fetch(
      `${API_ENDPOINT_SEARCH_PINS}/?q=${q}&page=${page}`,
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ errors: [ERROR_CODE_FETCH_BACKEND_FAILED] }),
      { status: 500 },
    );
  }

  return backendResponse;
};

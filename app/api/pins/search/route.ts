import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import {
  API_ENDPOINT_SEARCH_PINS,
  ERROR_CODE_FETCH_BACKEND_FAILED,
  ERROR_CODE_MISSING_ACCESS_TOKEN,
} from "@/lib/constants";
import { fetchWithAuthentication } from "@/lib/utils/fetch";

export async function GET(request: NextRequest) {
  // See https://nextjs.org/docs/app/building-your-application/routing/route-handlers#cookies
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json(
      { errors: [ERROR_CODE_MISSING_ACCESS_TOKEN] },
      { status: 401 },
    );
  }

  // See https://nextjs.org/docs/app/building-your-application/routing/route-handlers#url-query-parameters
  const queryParams = request.nextUrl.searchParams;
  const page = queryParams.get("page");
  const q = queryParams.get("q");

  let backendResponse;

  try {
    backendResponse = await fetchWithAuthentication({
      endpoint: `${API_ENDPOINT_SEARCH_PINS}/?q=${q}&page=${page}`,
      accessToken,
    });
  } catch (error) {
    return Response.json(
      { errors: [ERROR_CODE_FETCH_BACKEND_FAILED] },
      { status: 500 },
    );
  }

  return backendResponse;
}

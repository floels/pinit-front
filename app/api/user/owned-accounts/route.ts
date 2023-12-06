import {
  API_ENDPOINT_OWNED_ACCOUNTS,
  ERROR_CODE_FETCH_BACKEND_FAILED,
  ERROR_CODE_MISSING_ACCESS_TOKEN,
} from "@/lib/constants";
import { fetchWithAuthentication } from "@/lib/utils/fetch";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // See https://nextjs.org/docs/app/building-your-application/routing/route-handlers#cookies
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return new NextResponse(
      JSON.stringify({ errors: [ERROR_CODE_MISSING_ACCESS_TOKEN] }),
      { status: 401 },
    );
  }

  let backendResponse;

  try {
    backendResponse = await fetchWithAuthentication({
      endpoint: `${API_ENDPOINT_OWNED_ACCOUNTS}/`,
      accessToken,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ errors: [ERROR_CODE_FETCH_BACKEND_FAILED] }),
      { status: 500 },
    );
  }

  return backendResponse;
}

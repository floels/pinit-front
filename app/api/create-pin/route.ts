import {
  ACCESS_TOKEN_COOKIE_KEY,
  ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY,
  API_ENDPOINT_CREATE_PIN,
  ERROR_CODE_FETCH_BACKEND_FAILED,
  ERROR_CODE_MISSING_ACCESS_TOKEN,
  ERROR_CODE_MISSING_ACCOUNT_USERNAME_COOKIE,
} from "@/lib/constants";
import { fetchWithAuthentication } from "@/lib/utils/fetch";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  // See https://nextjs.org/docs/app/building-your-application/routing/route-handlers#cookies
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value;

  if (!accessToken) {
    return new NextResponse(
      JSON.stringify({ errors: [ERROR_CODE_MISSING_ACCESS_TOKEN] }),
      { status: 401 },
    );
  }

  const accountUsername = cookieStore.get(ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY)
    ?.value;

  if (!accountUsername) {
    return new NextResponse(
      JSON.stringify({ errors: [ERROR_CODE_MISSING_ACCOUNT_USERNAME_COOKIE] }),
      { status: 400 },
    );
  }

  const formData = await request.formData();

  let backendResponse;

  try {
    backendResponse = await fetchWithAuthentication({
      endpoint: `${API_ENDPOINT_CREATE_PIN}/`,
      accessToken,
      fetchOptions: {
        method: "POST",
        body: formData,
        headers: { "X-Username": accountUsername },
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ errors: [ERROR_CODE_FETCH_BACKEND_FAILED] }),
      { status: 500 },
    );
  }

  return backendResponse;
};

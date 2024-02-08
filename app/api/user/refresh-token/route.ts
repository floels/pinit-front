import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  API_BASE_URL,
  API_ENDPOINT_REFRESH_TOKEN,
  ERROR_CODE_FETCH_BACKEND_FAILED,
  ERROR_CODE_UNEXPECTED_SERVER_RESPONSE,
} from "@/lib/constants";

const ERROR_CODE_MISSING_REFRESH_TOKEN = "missing_refresh_token";

export const POST = async () => {
  // See https://nextjs.org/docs/app/building-your-application/routing/route-handlers#cookies
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return new NextResponse(
      JSON.stringify({ errors: [ERROR_CODE_MISSING_REFRESH_TOKEN] }),
      { status: 400 },
    );
  }

  let backendResponse;

  try {
    backendResponse = await fetch(
      `${API_BASE_URL}/${API_ENDPOINT_REFRESH_TOKEN}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      },
    );
  } catch {
    return new NextResponse(
      JSON.stringify({ errors: [ERROR_CODE_FETCH_BACKEND_FAILED] }),
      { status: 500 },
    );
  }

  let backendResponseData;

  try {
    backendResponseData = await backendResponse.json();
  } catch {
    return new NextResponse(
      JSON.stringify({ errors: [ERROR_CODE_UNEXPECTED_SERVER_RESPONSE] }),
      { status: 500 },
    );
  }

  if (!backendResponse.ok) {
    return new NextResponse(
      JSON.stringify({ errors: backendResponseData.errors }),
      { status: backendResponse.status },
    );
  }

  const {
    access_token: accessToken,
    access_token_expiration_utc: accessTokenExpirationDate,
  } = backendResponseData;

  const accessTokenCookie = {
    name: ACCESS_TOKEN_COOKIE_KEY,
    value: accessToken,
    path: "/",
    secure: true,
    httpOnly: true,
  };

  // See https://nextjs.org/docs/app/api-reference/functions/next-response#setname-value
  const response = new NextResponse(
    JSON.stringify({ access_token_expiration_utc: accessTokenExpirationDate }),
  );

  response.cookies.set(accessTokenCookie);

  return response;
};

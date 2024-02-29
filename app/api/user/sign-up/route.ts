import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  API_BASE_URL,
  API_ENDPOINT_SIGN_UP,
  ERROR_CODE_FETCH_BACKEND_FAILED,
  ERROR_CODE_UNEXPECTED_SERVER_RESPONSE,
  REFRESH_TOKEN_COOKIE_KEY,
} from "@/lib/constants";

export const POST = async (request: Request) => {
  const { email, password, birthdate } = await request.json();

  const backendRequestBody = JSON.stringify({ email, password, birthdate });

  let backendResponse;

  try {
    backendResponse = await fetch(`${API_BASE_URL}/${API_ENDPOINT_SIGN_UP}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: backendRequestBody,
    });
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

  const { access_token: accessToken, refresh_token: refreshToken } =
    backendResponseData;

  const accessTokenCookie = {
    name: ACCESS_TOKEN_COOKIE_KEY,
    value: accessToken,
    path: "/",
    secure: true,
    httpOnly: true,
  };

  const refreshTokenCookie = {
    name: REFRESH_TOKEN_COOKIE_KEY,
    value: refreshToken,
    path: "/",
    secure: true,
    httpOnly: true,
  };

  // See https://nextjs.org/docs/app/api-reference/functions/next-response#setname-value
  const response = new NextResponse();

  response.cookies.set(accessTokenCookie);
  response.cookies.set(refreshTokenCookie);

  return response;
};

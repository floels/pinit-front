import {
  API_BASE_URL,
  ENDPOINT_SIGN_UP,
  ERROR_CODE_FETCH_BACKEND_FAILED,
} from "@/lib/constants";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password, birthdate } = await request.json();

  let backendResponse;

  try {
    backendResponse = await fetch(`${API_BASE_URL}/${ENDPOINT_SIGN_UP}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        birthdate,
      }),
    });
  } catch (error) {
    return Response.json(
      { errors: [ERROR_CODE_FETCH_BACKEND_FAILED] },
      { status: 500 },
    );
  }

  const backendResponseData = await backendResponse.json();

  if (!backendResponse.ok) {
    return Response.json(
      { errors: backendResponseData.errors },
      { status: backendResponseData.status },
    );
  }

  const { access_token: accessToken, refresh_token: refreshToken } =
    backendResponseData;

  const accessTokenCookie = {
    name: "accessToken",
    value: accessToken,
    path: "/",
    secure: true,
    httpOnly: true,
  };

  const refreshTokenCookie = {
    name: "refreshToken",
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
}

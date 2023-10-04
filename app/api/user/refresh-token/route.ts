import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  API_BASE_URL,
  ENDPOINT_REFRESH_TOKEN,
  ERROR_CODE_FETCH_BACKEND_FAILED,
} from "@/lib/constants";

const ERROR_CODE_MISSING_REFRESH_TOKEN = "missing_refresh_token";

export async function POST() {
  // See https://nextjs.org/docs/app/building-your-application/routing/route-handlers#cookies
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json(
      { errors: [ERROR_CODE_MISSING_REFRESH_TOKEN] },
      { status: 400 },
    );
  }

  let backendResponse;

  try {
    backendResponse = await fetch(`${API_BASE_URL}/${ENDPOINT_REFRESH_TOKEN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
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

  const { access_token: accessToken } = backendResponseData;

  const accessTokenCookie = {
    name: "accessToken",
    value: accessToken,
    path: "/",
    secure: true,
    httpOnly: true,
  };

  // See https://nextjs.org/docs/app/api-reference/functions/next-response#setname-value
  const response = new NextResponse();

  response.cookies.set(accessTokenCookie);

  return response;
}

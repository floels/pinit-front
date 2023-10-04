import { API_BASE_URL, ENDPOINT_OBTAIN_TOKEN } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const backendResponse = await fetch(
    `${API_BASE_URL}/${ENDPOINT_OBTAIN_TOKEN}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );

  const { access_token: accessToken, refresh_token: refreshToken } =
    await backendResponse.json();

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

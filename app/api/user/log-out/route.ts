import { NextResponse } from "next/server";

export const POST = async () => {
  const clearedAccessTokenCookie = {
    name: "accessToken",
    value: "",
    path: "/",
    secure: true,
    httpOnly: true,
    maxAge: 0,
  };

  const clearedRefreshTokenCookie = {
    name: "refreshToken",
    value: "",
    path: "/",
    secure: true,
    httpOnly: true,
    maxAge: 0,
  };

  // See https://nextjs.org/docs/app/api-reference/functions/next-response#setname-value
  const response = new NextResponse();

  response.cookies.set(clearedAccessTokenCookie);
  response.cookies.set(clearedRefreshTokenCookie);

  return response;
};

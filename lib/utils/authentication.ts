import Cookies from "js-cookie";
import {
  API_BASE_URL,
  ENDPOINT_REFRESH_TOKEN,
  ERROR_CODE_FETCH_FAILED,
  ERROR_CODE_REFRESH_TOKEN_FAILED,
} from "../constants";

export const refreshAccessToken = async () => {
  let response, data;

  const refreshToken = Cookies.get("refreshToken");

  try {
    response = await fetch(`${API_BASE_URL}/${ENDPOINT_REFRESH_TOKEN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    data = await response.json();
  } catch (error) {
    throw new Error(ERROR_CODE_FETCH_FAILED);
  }

  if (!response.ok) {
    throw new Error(ERROR_CODE_REFRESH_TOKEN_FAILED);
  }

  Cookies.set("accessToken", data.access_token);
};

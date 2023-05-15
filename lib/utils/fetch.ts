import {
  API_BASE_URL,
  ERROR_CODE_FETCH_FAILED,
  ERROR_CODE_INVALID_ACCESS_TOKEN,
} from "../constants";

export const fetchWithAuthentication = async ({
  endpoint,
  accessToken,
  fetchOptions,
}: {
  endpoint: string;
  accessToken: string;
  fetchOptions?: {};
}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      ...fetchOptions,
    });
  } catch (error) {
    throw new Error(ERROR_CODE_FETCH_FAILED);
  }

  if (!response.ok) {
    if (response.status === 401) {
      // Access token invalid (likely expired)
      throw new Error(ERROR_CODE_INVALID_ACCESS_TOKEN);
    }

    const { errors } = await response.json();

    if (errors?.length > 0) {
      throw new Error(errors[0]);
    }

    // Response body does not have a non-empty 'errors' array attribute
    throw new Error(ERROR_CODE_FETCH_FAILED);
  }

  return response.json();
};

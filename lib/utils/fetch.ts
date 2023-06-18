import { API_BASE_URL } from "../constants";

export const fetchWithAuthentication = async ({
  endpoint,
  accessToken,
  fetchOptions,
}: {
  endpoint: string;
  accessToken: string;
  fetchOptions?: {};
}) => {
  return fetch(`${API_BASE_URL}/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    ...fetchOptions,
  });
};

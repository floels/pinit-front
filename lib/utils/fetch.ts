import { API_BASE_URL } from "../constants";

export const fetchWithAuthentication = async ({
  endpoint,
  accessToken,
  fetchOptions,
}: {
  endpoint: string;
  accessToken: string;
  fetchOptions?: RequestInit;
}) => {
  return fetch(`${API_BASE_URL}/${endpoint}`, {
    ...fetchOptions,
    headers: {
      ...fetchOptions?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

import { API_BASE_URL, API_ENDPOINT_OBTAIN_DEMO_TOKEN } from "@/lib/constants";
import {
  getNextResponse,
  getNextResponseBackendFetchFailed,
  getNextResponseUnparsableBackendResponse,
} from "@/lib/utils/apiRoutes";
import { getNextResponseSuccess } from "../obtain-token/route";

export const GET = async () => {
  let backendResponse;

  try {
    const url = `${API_BASE_URL}/${API_ENDPOINT_OBTAIN_DEMO_TOKEN}`;

    backendResponse = await fetch(url);
  } catch {
    return getNextResponseBackendFetchFailed();
  }

  let backendResponseData;

  try {
    backendResponseData = await backendResponse.json();
  } catch {
    return getNextResponseUnparsableBackendResponse();
  }

  if (!backendResponse.ok) {
    return getNextResponse({
      backendResponseData,
      status: backendResponse.status,
    });
  }

  return getNextResponseSuccess({ backendResponseData });
};

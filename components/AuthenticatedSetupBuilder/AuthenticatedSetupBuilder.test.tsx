import { withQueryClient } from "@/lib/utils/testing";
import { render, waitFor } from "@testing-library/react";
import AuthenticatedSetupBuilder from "./AuthenticatedSetupBuilder";
import {
  API_ROUTE_MY_ACCOUNT_DETAILS,
  API_ROUTE_REFRESH_TOKEN,
} from "@/lib/constants";

const renderComponent = () => {
  render(withQueryClient(<AuthenticatedSetupBuilder />));
};

it(`refreshes access token if no expiration date in local storage,
and only then fetches account details`, async () => {
  let resolvePromise: any;

  const controlledPromise = new Promise<Response>((resolve) => {
    resolvePromise = resolve;
  });

  fetchMock.mockImplementationOnce(() => controlledPromise);

  renderComponent();

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(API_ROUTE_REFRESH_TOKEN, {
      method: "POST",
    });
  });

  expect(fetch).toHaveBeenCalledTimes(1);

  resolvePromise();

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(API_ROUTE_MY_ACCOUNT_DETAILS);
  });
});

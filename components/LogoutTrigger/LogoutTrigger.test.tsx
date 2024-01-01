import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import LogoutTrigger from "./LogoutTrigger";
import { API_ROUTE_LOG_OUT } from "@/lib/constants";
import { toast } from "react-toastify";
import en from "@/messages/en.json";

jest.mock("react-toastify", () => ({
  toast: {
    warn: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockRefresh = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  refresh: mockRefresh,
});

beforeEach(() => {
  mockRefresh.mockClear();
});

it("should display overlay while logging out, and not call router.refresh() before successful logout", () => {
  const eternalPromise = new Promise<Response>(() => {});
  fetchMock.mockImplementationOnce(() => eternalPromise);

  render(<LogoutTrigger />);

  screen.getByTestId("logout-trigger-overlay");
  expect(mockRefresh).not.toHaveBeenCalled();
});

it("should call 'router.refresh()' upon successful logout request", async () => {
  fetchMock.mockOnceIf(API_ROUTE_LOG_OUT, JSON.stringify({}));

  render(<LogoutTrigger />);

  await waitFor(() => {
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});

it("should display warning toast and not refresh upon logout fetch error", async () => {
  fetchMock.mockRejectOnce(new Error("Network failure"));

  render(<LogoutTrigger />);

  await waitFor(() => {
    expect(toast.warn).toHaveBeenLastCalledWith(
      en.Common.CONNECTION_ERROR,
      expect.anything(), // we don't really care about the options argument here
    );

    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
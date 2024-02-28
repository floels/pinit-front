import { render, waitFor } from "@testing-library/react";
import AccountDetailsFetcher from "./AccountDetailsFetcher";
import {
  API_ROUTE_MY_ACCOUNT_DETAILS,
  PROFILE_PICTURE_URL_LOCAL_STORAGE_KEY,
} from "@/lib/constants";
import { MockLocalStorage, withQueryClient } from "@/lib/utils/testing";
import { LogOutContext } from "@/contexts/logOutContext";

(localStorage as any) = new MockLocalStorage();

const mockLogOut = jest.fn();

const renderComponent = () => {
  render(
    <LogOutContext.Provider value={{ logOut: mockLogOut }}>
      {withQueryClient(<AccountDetailsFetcher />)};
    </LogOutContext.Provider>,
  );
};

const accountDetails = {
  type: "personal",
  username: "johndoe",
  display_name: "John Doe",
  initial: "J",
  profile_picture_url: "https://example.com/profile-picture.jpg",
};

it(`persists profile picture URL upon successful fetch`, async () => {
  fetchMock.mockOnceIf(
    API_ROUTE_MY_ACCOUNT_DETAILS,
    JSON.stringify(accountDetails),
  );

  renderComponent();

  await waitFor(() => {
    expect(localStorage.getItem(PROFILE_PICTURE_URL_LOCAL_STORAGE_KEY)).toEqual(
      accountDetails.profile_picture_url,
    );
  });
});

it("triggers logout upon 401 response", async () => {
  fetchMock.mockOnceIf(API_ROUTE_MY_ACCOUNT_DETAILS, JSON.stringify({}), {
    status: 401,
  });

  renderComponent();

  await waitFor(() => {
    expect(mockLogOut).toHaveBeenCalledTimes(1);
  });
});

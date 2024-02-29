import { render, waitFor } from "@testing-library/react";
import AccountDetailsFetcher from "./AccountDetailsFetcher";
import {
  API_ROUTE_MY_ACCOUNT_DETAILS,
  PROFILE_PICTURE_URL_LOCAL_STORAGE_KEY,
  USERNAME_LOCAL_STORAGE_KEY,
} from "@/lib/constants";
import { MockLocalStorage, withQueryClient } from "@/lib/utils/testing";
import { LogOutContext } from "@/contexts/logOutContext";
import { AccountContext } from "@/contexts/accountContext";
import { serializeAccountPrivateDetails } from "@/lib/utils/serializers";

(localStorage as any) = new MockLocalStorage();

const mockLogOut = jest.fn();

const mockSetAccount = jest.fn();

const renderComponent = () => {
  render(
    <LogOutContext.Provider value={{ logOut: mockLogOut }}>
      <AccountContext.Provider
        value={{ account: null, setAccount: mockSetAccount }}
      >
        {withQueryClient(<AccountDetailsFetcher />)};
      </AccountContext.Provider>
    </LogOutContext.Provider>,
  );
};

const accountDetails = {
  type: "personal",
  username: "johndoe",
  display_name: "John Doe",
  initial: "J",
  profile_picture_url: "https://example.com/profile-picture.jpg",
  boards: [{ id: "1234", title: "Board title", cover_picture_url: null }],
};

it(`calls 'setAccount' with proper arguments and persists 
relevant data upon successful fetch`, async () => {
  fetchMock.mockOnceIf(
    API_ROUTE_MY_ACCOUNT_DETAILS,
    JSON.stringify(accountDetails),
  );

  renderComponent();

  await waitFor(() => {
    expect(mockSetAccount).toHaveBeenCalledWith(
      serializeAccountPrivateDetails(accountDetails),
    );

    expect(localStorage.getItem(USERNAME_LOCAL_STORAGE_KEY)).toEqual(
      accountDetails.username,
    );

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

import { render } from "@testing-library/react";
import LogoutTrigger from "./LogoutTrigger";
import { LogOutContext } from "@/contexts/logOutContext";

const mockLogOut = jest.fn();

const renderComponent = () => {
  render(
    <LogOutContext.Provider value={{ logOut: mockLogOut }}>
      <LogoutTrigger />
    </LogOutContext.Provider>,
  );
};

it("calls 'logOut' upon initial render", () => {
  renderComponent();

  expect(mockLogOut).toHaveBeenCalledTimes(1);
});

/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import en from "@/messages/en.json";
import AccountOptionsFlyout from "./AccountOptionsFlyout";

const labels = en.HomePageAuthenticated.Header.AccountOptionsFlyout;

const handleClickLogOut = jest.fn();

describe("AccountOptionsFlyout", () => {
    it("should call handleClickLogOut when user clicks on 'Log out'", async () => {
        const user = userEvent.setup();

        render(<AccountOptionsFlyout handleClickLogOut={handleClickLogOut} labels={labels} />);

        const logOutElement = screen.getByText(labels.LOG_OUT);

        await user.click(logOutElement);

        expect(handleClickLogOut).toHaveBeenCalledTimes(1);
    });
});

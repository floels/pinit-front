import { render } from "@testing-library/react";
import AccessTokenRefresher from "./AccessTokenRefresher";

jest.mock("next/navigation", () => require("next-router-mock"));

describe("AccessTokenRefresh", () => {
    it("should render", () => {
        render(<AccessTokenRefresher />);
    });
});

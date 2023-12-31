import { useQuery } from "@tanstack/react-query";
import ClientsAndContextsProvider from "./ClientsAndContextsProvider";
import { render, screen } from "@testing-library/react";
import { useAccountsContext } from "@/contexts/AccountsContext";

it("should give its child access to 'useQuery'", () => {
  const ChildElement = () => {
    useQuery({ queryKey: ["dummyQuery"], queryFn: () => ({}) });

    return <div data-testid="child-element" />;
  };

  render(
    <ClientsAndContextsProvider>
      <ChildElement />
    </ClientsAndContextsProvider>,
  );

  // Just check that the child element rendered successfully:
  screen.getByTestId("child-element");
});

it("should give its child access to context AccountsContext", () => {
  const ChildElement = () => {
    useAccountsContext();

    return <div data-testid="child-element" />;
  };

  render(
    <ClientsAndContextsProvider>
      <ChildElement />
    </ClientsAndContextsProvider>,
  );

  // Just check that the child element rendered successfully:
  screen.getByTestId("child-element");
});

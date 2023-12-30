import { AccountType } from "@/lib/types";
import { createContext, useContext, useState } from "react";

type AccountsContextType = {
  accounts: AccountType[] | null;
  setAccounts: (accounts: AccountType[]) => void;
  isFetchingAccounts: boolean;
  setIsFetchingAccounts: (isFetchingAccounts: boolean) => void;
  isErrorFetchingAccounts: boolean;
  setIsErrorFetchingAccounts: (isErrorFetchingAccounts: boolean) => void;
  activeAccountUsername: string | null;
  setActiveAccountUsername: (activeAccount: string) => void;
};

export const AccountsContext = createContext<AccountsContextType | undefined>(
  undefined,
);

export const useAccountsContext = () => {
  const context = useContext(AccountsContext);

  if (context === undefined) {
    throw new Error(
      "useAccount must be used within an AccountsContextProvider",
    );
  }

  return context;
};

type AccountsContextProviderProps = {
  children: React.ReactNode;
};

export const AccountsContextProvider = ({
  children,
}: AccountsContextProviderProps) => {
  const [accounts, setAccounts] = useState<AccountType[] | null>(null);
  const [isFetchingAccounts, setIsFetchingAccounts] = useState(false);
  const [isErrorFetchingAccounts, setIsErrorFetchingAccounts] = useState(false);
  const [activeAccountUsername, setActiveAccountUsername] = useState<
    string | null
  >(null);

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        setAccounts,
        isFetchingAccounts,
        setIsFetchingAccounts,
        isErrorFetchingAccounts,
        setIsErrorFetchingAccounts,
        activeAccountUsername,
        setActiveAccountUsername,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

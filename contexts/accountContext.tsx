"use client";

import { AccountType } from "@/lib/types";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type AccountContextType = {
  account: AccountType | null;
  setAccount: Dispatch<SetStateAction<AccountType | null>>;
};

export const AccountContext = createContext<AccountContextType>({
  account: null,
  setAccount: () => {},
});

export const AccountContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [account, setAccount] = useState<AccountType | null>(null);

  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => useContext(AccountContext);

import { createContext, useContext, useState } from "react";

type ActiveAccountContextType = {
  activeAccountUsername: string | null;
  setActiveAccountUsername: (activeAccount: string) => void;
};

export const ActiveAccountContext = createContext<
  ActiveAccountContextType | undefined
>(undefined);

export const useActiveAccountContext = () => {
  const context = useContext(ActiveAccountContext);

  if (context === undefined) {
    throw new Error("useAccount must be used within a AccountProvider");
  }

  return context;
};

type ActiveAccountContextProviderProps = {
  children: React.ReactNode;
};

export const ActiveAccountContextProvider = ({
  children,
}: ActiveAccountContextProviderProps) => {
  const [activeAccountUsername, setActiveAccountUsername] = useState<
    string | null
  >(null);

  return (
    <ActiveAccountContext.Provider
      value={{
        activeAccountUsername,
        setActiveAccountUsername,
      }}
    >
      {children}
    </ActiveAccountContext.Provider>
  );
};

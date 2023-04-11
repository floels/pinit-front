import { createContext, useReducer, Dispatch } from "react";

type State = {
  isAuthenticated: boolean;
};

export type Action = {
  type: "SET_IS_AUTHENTICATED";
  payload: boolean;
};

const initialState = { isAuthenticated: false };

const GlobalStateContext = createContext({
  state: initialState,
  dispatch: (() => {}) as Dispatch<Action>,
});

export default GlobalStateContext;

const globalStateReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_IS_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const GlobalStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(globalStateReducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

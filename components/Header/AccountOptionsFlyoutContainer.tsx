import { useEffect, useRef, useState } from "react";
import LogoutTrigger from "../LogoutTrigger/LogoutTrigger";
import AccountOptionsFlyout from "./AccountOptionsFlyout";

type AccountOptionsFlyoutContainerProps = {
  handleClickOutOfAccountOptionsFlyout: () => void;
};

const AccountOptionsFlyoutContainer = ({
  handleClickOutOfAccountOptionsFlyout,
}: AccountOptionsFlyoutContainerProps) => {
  const accountOptionsFlyoutRef = useRef<HTMLDivElement>(null);

  const [clickedLogOut, setClickedLogOut] = useState(false);

  const handleClickLogOut = () => {
    setClickedLogOut(true);
  };

  const handleClickDocument = (event: MouseEvent) => {
    const target = event.target as Node;

    const userClickedOutOfAccountOptionsFlyout =
      !accountOptionsFlyoutRef.current?.contains(target);

    if (userClickedOutOfAccountOptionsFlyout) {
      handleClickOutOfAccountOptionsFlyout();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickDocument);

    return () => {
      document.removeEventListener("click", handleClickDocument);
    };
  }, []);

  if (clickedLogOut) {
    return <LogoutTrigger />;
  }

  return (
    <AccountOptionsFlyout
      ref={accountOptionsFlyoutRef}
      handleClickLogOut={handleClickLogOut}
    />
  );
};

export default AccountOptionsFlyoutContainer;

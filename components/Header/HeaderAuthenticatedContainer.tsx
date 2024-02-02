"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import HeaderAuthenticated from "./HeaderAuthenticated";

const HeaderAuthenticatedContainer = () => {
  const t = useTranslations("Common");

  const accountOptionsFlyoutRef = useRef<HTMLDivElement>(null);
  const accountOptionsButtonRef = useRef<HTMLButtonElement>(null);

  const refs = {
    accountOptionsFlyoutRef,
    accountOptionsButtonRef,
  };

  const [isProfileLinkHovered, setIsProfileLinkHovered] = useState(false);
  const [isAccountOptionsButtonHovered, setIsAccountOptionsButtonHovered] =
    useState(false);
  const [isAccountOptionsFlyoutOpen, setIsAccountOptionsFlyoutOpen] =
    useState(false);

  const handleMouseEnterProfileLink = () => {
    setIsProfileLinkHovered(true);
  };

  const handleMouseLeaveProfileLink = () => {
    setIsProfileLinkHovered(false);
  };

  const handleMouseEnterAccountOptionsButton = () => {
    setIsAccountOptionsButtonHovered(true);
  };

  const handleMouseLeaveAccountOptionsButton = () => {
    setIsAccountOptionsButtonHovered(false);
  };

  const handleClickAccountOptionsButton = () => {
    setIsAccountOptionsFlyoutOpen(!isAccountOptionsFlyoutOpen);
  };

  const handleClickDocument = (event: MouseEvent) => {
    const target = event.target as Node;
    const userClickedOutOfAccountOptionsFlyoutOrButton =
      !accountOptionsFlyoutRef.current?.contains(target) &&
      !accountOptionsButtonRef.current?.contains(target);

    if (userClickedOutOfAccountOptionsFlyoutOrButton) {
      setIsAccountOptionsFlyoutOpen(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsAccountOptionsFlyoutOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickDocument);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickDocument);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <HeaderAuthenticated
      handleMouseEnterProfileLink={handleMouseEnterProfileLink}
      handleMouseLeaveProfileLink={handleMouseLeaveProfileLink}
      isProfileLinkHovered={isProfileLinkHovered}
      handleClickAccountOptionsButton={handleClickAccountOptionsButton}
      handleMouseEnterAccountOptionsButton={
        handleMouseEnterAccountOptionsButton
      }
      handleMouseLeaveAccountOptionsButton={
        handleMouseLeaveAccountOptionsButton
      }
      isAccountOptionsButtonHovered={isAccountOptionsButtonHovered}
      isAccountOptionsFlyoutOpen={isAccountOptionsFlyoutOpen}
      ref={refs as any}
    />
  );
};

export default HeaderAuthenticatedContainer;

"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import HeaderAuthenticated from "./HeaderAuthenticated";
import {
  PROFILE_PICTURE_URL_LOCAL_STORAGE_KEY,
  USERNAME_LOCAL_STORAGE_KEY,
} from "@/lib/constants";
import { useAccountContext } from "@/contexts/accountContext";

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

  const { account } = useAccountContext();

  // The idea here is to fall back to local storage if the account context
  // is not yet available, which will typically be the case while
  // <AccountDetailsFetcher /> is still fetching:
  const username =
    account?.username || localStorage?.getItem(USERNAME_LOCAL_STORAGE_KEY);

  const profilePictureURL =
    account?.profilePictureURL ||
    localStorage?.getItem(PROFILE_PICTURE_URL_LOCAL_STORAGE_KEY);

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
      username={username}
      profilePictureURL={profilePictureURL}
      isProfileLinkHovered={isProfileLinkHovered}
      isAccountOptionsButtonHovered={isAccountOptionsButtonHovered}
      isAccountOptionsFlyoutOpen={isAccountOptionsFlyoutOpen}
      handleMouseEnterProfileLink={handleMouseEnterProfileLink}
      handleMouseLeaveProfileLink={handleMouseLeaveProfileLink}
      handleClickAccountOptionsButton={handleClickAccountOptionsButton}
      handleMouseEnterAccountOptionsButton={
        handleMouseEnterAccountOptionsButton
      }
      handleMouseLeaveAccountOptionsButton={
        handleMouseLeaveAccountOptionsButton
      }
      ref={refs as any}
    />
  );
};

export default HeaderAuthenticatedContainer;

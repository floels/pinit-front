"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import HeaderAuthenticated from "./HeaderAuthenticated";
import { PROFILE_PICTURE_URL_LOCAL_STORAGE_KEY } from "@/lib/constants";

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
  const [profilePictureURL, setProfilePictureURL] = useState<string | null>(
    null,
  );

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

  useEffect(() => {
    const profilePictureURLInLocalStorage = localStorage?.getItem(
      PROFILE_PICTURE_URL_LOCAL_STORAGE_KEY,
    );

    if (profilePictureURLInLocalStorage) {
      setProfilePictureURL(profilePictureURLInLocalStorage);
    }
  }, []);

  return (
    <HeaderAuthenticated
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

"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { API_ROUTE_OWNED_ACCOUNTS } from "@/lib/constants";
import { API_ROUTE_LOG_OUT } from "@/lib/constants";
import { AccountType } from "@/lib/types";
import { getAccountsWithCamelizedKeys } from "@/lib/utils/adapters";
import HeaderAuthenticated from "./HeaderAuthenticated";

const HeaderAuthenticatedContainer = () => {
  const router = useRouter();

  const t = useTranslations("Common");

  const createFlyoutRef = useRef<HTMLDivElement>(null);
  const createButtonRef = useRef<HTMLDivElement>(null);
  const accountOptionsFlyoutRef = useRef<HTMLDivElement>(null);
  const accountOptionsButtonRef = useRef<HTMLButtonElement>(null);

  const refs = {
    createFlyoutRef,
    createButtonRef,
    accountOptionsFlyoutRef,
    accountOptionsButtonRef,
  };

  const [isCreateFlyoutOpen, setIsCreateFlyoutOpen] = useState(false);
  const [isProfileLinkHovered, setIsProfileLinkHovered] = useState(false);
  const [isAccountOptionsButtonHovered, setIsAccountOptionsButtonHovered] =
    useState(false);
  const [isAccountOptionsFlyoutOpen, setIsAccountOptionsFlyoutOpen] =
    useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [ownedAccounts, setOwnedAccounts] = useState<AccountType[]>([]);

  const handleClickCreateButton = () => {
    setIsCreateFlyoutOpen(!isCreateFlyoutOpen);
  };

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

  const handleClickDocument = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        isCreateFlyoutOpen &&
        createFlyoutRef.current &&
        !createFlyoutRef.current.contains(target) &&
        createButtonRef.current &&
        !createButtonRef.current.contains(target)
        // NB: we don't do anything if the user clicks on the account options button
        // as this click is managed by the `handleClickCreateButton` function above
      ) {
        setIsCreateFlyoutOpen(false);
      }

      if (
        isAccountOptionsFlyoutOpen &&
        accountOptionsFlyoutRef.current &&
        !accountOptionsFlyoutRef.current.contains(target) &&
        accountOptionsButtonRef.current &&
        !accountOptionsButtonRef.current.contains(target)
      ) {
        setIsAccountOptionsFlyoutOpen(false);
      }
    },
    [isAccountOptionsFlyoutOpen, isCreateFlyoutOpen],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isCreateFlyoutOpen) {
          setIsCreateFlyoutOpen(false);
        }
        if (isAccountOptionsFlyoutOpen) {
          setIsAccountOptionsFlyoutOpen(false);
        }
      }
    },
    [isAccountOptionsFlyoutOpen, isCreateFlyoutOpen],
  );

  const handleClickLogOut = async () => {
    try {
      await fetch(API_ROUTE_LOG_OUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.warn(t("CONNECTION_ERROR"));
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickDocument);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickDocument);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClickDocument, handleKeyDown]);

  const fetchOwnedAccounts = useCallback(async () => {
    let response, responseData;

    setIsFetching(true);

    try {
      response = await fetch(API_ROUTE_OWNED_ACCOUNTS, {
        method: "GET",
      });

      responseData = await response.json();
    } catch (error) {
      setFetchFailed(true);
      return;
    } finally {
      setIsFetching(false);
    }

    if (!response.ok) {
      setFetchFailed(true);
      return;
    }

    const { results } = responseData;

    if (!results || !results?.length) {
      setFetchFailed(true);
      return;
    }

    setOwnedAccounts(getAccountsWithCamelizedKeys(results));
  }, []);

  useEffect(() => {
    fetchOwnedAccounts();
  }, [fetchOwnedAccounts]);

  return (
    <HeaderAuthenticated
      handleClickCreateButton={handleClickCreateButton}
      isCreateFlyoutOpen={isCreateFlyoutOpen}
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
      handleClickLogOut={handleClickLogOut}
      isFetching={isFetching}
      fetchFailed={fetchFailed}
      ownedAccounts={ownedAccounts}
      ref={refs as any}
    />
  );
};

export default HeaderAuthenticatedContainer;

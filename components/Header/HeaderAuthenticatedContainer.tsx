"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { API_ROUTE_OWNED_ACCOUNTS } from "@/lib/constants";
import { API_ROUTE_LOG_OUT } from "@/lib/constants";
import { getAccountsWithCamelizedKeys } from "@/lib/utils/adapters";
import HeaderAuthenticated from "./HeaderAuthenticated";
import { ResponseKOError } from "@/lib/customErrors";

const HeaderAuthenticatedContainer = () => {
  const router = useRouter();

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

  const handleClickDocument = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node;
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
    [isAccountOptionsFlyoutOpen],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isAccountOptionsFlyoutOpen) {
          setIsAccountOptionsFlyoutOpen(false);
        }
      }
    },
    [isAccountOptionsFlyoutOpen],
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

  const fetchOwnedAccounts = async () => {
    const response = await fetch(API_ROUTE_OWNED_ACCOUNTS, {
      method: "GET",
    });

    if (!response.ok) {
      throw new ResponseKOError();
    }

    const responseData = await response.json();

    return getAccountsWithCamelizedKeys(responseData.results);
  };

  const fetchOwnedAccountsQuery = useQuery({
    queryKey: ["getOwnedAccounts"],
    queryFn: fetchOwnedAccounts,
    retry: false,
  });

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
      handleClickLogOut={handleClickLogOut}
      isFetching={fetchOwnedAccountsQuery.isPending}
      fetchFailed={fetchOwnedAccountsQuery.isError}
      ownedAccounts={fetchOwnedAccountsQuery.data || []}
      ref={refs as any}
    />
  );
};

export default HeaderAuthenticatedContainer;

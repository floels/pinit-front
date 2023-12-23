"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { API_ROUTE_LOG_OUT, API_ROUTE_REFRESH_TOKEN } from "@/lib/constants";
import SpinnerBelowHeader from "../Spinners/SpinnerBelowHeader";
import { ResponseKOError } from "@/lib/customErrors";

const AccessTokenRefresher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const fetchRefreshedToken = async () => {
    const response = await fetch(API_ROUTE_REFRESH_TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new ResponseKOError();
    }

    return {};
  };

  const refreshTokenQuery = useQuery({
    queryKey: ["refreshToken"],
    queryFn: fetchRefreshedToken,
  });

  useEffect(() => {
    const logout = async () => {
      await fetch(API_ROUTE_LOG_OUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (pathname === "/") {
        router.refresh();
      } else {
        router.push("/");
      }
    };

    if (refreshTokenQuery.isError) {
      logout();
    } else if (refreshTokenQuery.isSuccess) {
      router.refresh();
    }
  }, [refreshTokenQuery, router]);

  return <SpinnerBelowHeader />;
};

export default AccessTokenRefresher;

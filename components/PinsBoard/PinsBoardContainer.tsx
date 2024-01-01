"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { appendQueryParam } from "@/lib/utils/strings";
import PinsBoard from "./PinsBoard";
import { PinType } from "@/lib/types";
import { getPinsWithCamelCaseKeys } from "@/lib/utils/adapters";

type PinsBoardContainerProps = {
  initialPins: PinType[];
  fetchPinsAPIRoute: string;
  errorCode?: string;
};

const PinsBoardContainer = ({
  initialPins,
  fetchPinsAPIRoute,
  errorCode,
}: PinsBoardContainerProps) => {
  const t = useTranslations("Common");

  const [currentEndpointPage, setCurrentEndpointPage] = useState(1);
  const [pins, setPins] = useState<PinType[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    setPins([...initialPins]);
  }, [initialPins]);

  const fetchNextPinsAndFallBack = async () => {
    try {
      await fetchNextPins();
    } catch (error) {
      toast.warn(t("CONNECTION_ERROR"), {
        toastId: "toast-pins-board-connection-error",
      });
      setIsFetching(false);
    }
  };

  const fetchNextPins = async () => {
    const nextEndpointPage = currentEndpointPage + 1;

    setIsFetching(true);

    const url = appendQueryParam(
      fetchPinsAPIRoute,
      "page",
      nextEndpointPage.toString(),
    );

    const newPinsResponse = await fetch(url, { method: "GET" });

    setIsFetching(false);

    if (!newPinsResponse.ok) {
      setFetchFailed(true);
      return;
    }

    setFetchFailed(false);

    await updateStateWithNewPinsResponse(newPinsResponse);
  };

  const updateStateWithNewPinsResponse = async (newPinsResponse: Response) => {
    const newPinsResponseData = await newPinsResponse.json();

    const newPinsFetched = newPinsResponseData.results;

    const newPins = getPinsWithCamelCaseKeys(newPinsFetched);

    setPins((existingPins) => [...existingPins, ...newPins]);

    setCurrentEndpointPage((currentEndpointPage) => currentEndpointPage + 1);
  };

  const isFetchError = errorCode !== undefined || fetchFailed;

  return (
    <PinsBoard
      pins={pins}
      isFetching={isFetching}
      isFetchError={isFetchError}
      handleFetchMorePins={fetchNextPinsAndFallBack}
    />
  );
};

export default PinsBoardContainer;
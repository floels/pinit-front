"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { appendQueryParam, getPinsWithCamelizedKeys } from "@/lib/utils/misc";
import PinsBoardDisplay from "./PinsBoardDisplay";
import { PinType } from "@/lib/types";

type PinsBoardClientProps = {
  initialPins: PinType[];
  fetchPinsAPIRoute: string;
  labels: {
    commons: { [key: string]: any };
    component: { [key: string]: any };
  };
  errorCode?: string;
};

const PinsBoardClient = ({
  initialPins,
  fetchPinsAPIRoute,
  labels,
  errorCode,
}: PinsBoardClientProps) => {
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
      toast.warn(labels.commons.CONNECTION_ERROR);
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

    const newPins = getPinsWithCamelizedKeys(newPinsResponseData);

    setPins((existingPins) => [...existingPins, ...newPins]);

    setCurrentEndpointPage((currentEndpointPage) => currentEndpointPage + 1);
  };

  const isFetchError = errorCode !== undefined || fetchFailed;

  return (
    <PinsBoardDisplay
      pins={pins}
      labels={labels}
      isFetching={isFetching}
      isFetchError={isFetchError}
      handleFetchMorePins={fetchNextPinsAndFallBack}
    />
  );
};

export default PinsBoardClient;

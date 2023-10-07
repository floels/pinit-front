"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { PinThumbnailType } from "./PinThumbnail";
import {
  appendQueryParam,
  getPinThumbnailsWithCamelizedKeys,
} from "@/lib/utils/misc";
import PinsBoardDisplay from "./PinsBoardDisplay";

type PinsBoardClientProps = {
  initialPinThumbnails: PinThumbnailType[];
  fetchThumbnailsAPIRoute: string;
  labels: {
    commons: { [key: string]: any };
    component: { [key: string]: any };
  };
  errorCode?: string;
};

const PinsBoardClient = ({
  initialPinThumbnails,
  fetchThumbnailsAPIRoute,
  labels,
  errorCode,
}: PinsBoardClientProps) => {
  const [currentEndpointPage, setCurrentEndpointPage] = useState(1);
  const [pinThumbnails, setPinThumbnails] = useState<PinThumbnailType[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    setPinThumbnails([...initialPinThumbnails]);
  }, [initialPinThumbnails]);

  const fetchNextPinThumbnailsAndFallBack = async () => {
    try {
      await fetchNextPinThumbnails();
    } catch (error) {
      toast.warn(labels.commons.CONNECTION_ERROR);
      setIsFetching(false);
    }
  };

  const fetchNextPinThumbnails = async () => {
    const nextEndpointPage = currentEndpointPage + 1;

    setIsFetching(true);

    const url = appendQueryParam(
      fetchThumbnailsAPIRoute,
      "page",
      nextEndpointPage.toString(),
    );

    const newPinThumbnailsResponse = await fetch(url, { method: "GET" });

    setIsFetching(false);

    if (!newPinThumbnailsResponse.ok) {
      setFetchFailed(true);
      return;
    }

    setFetchFailed(false);

    await updateStateWithNewPinThumbnailsResponse(newPinThumbnailsResponse);
  };

  const updateStateWithNewPinThumbnailsResponse = async (
    newPinThumbnailsResponse: Response,
  ) => {
    const newPinThumbnailsResponseData = await newPinThumbnailsResponse.json();

    const newPinThumbnails = getPinThumbnailsWithCamelizedKeys(
      newPinThumbnailsResponseData,
    );

    setPinThumbnails((existingPinThumbnails) => [
      ...existingPinThumbnails,
      ...newPinThumbnails,
    ]);

    setCurrentEndpointPage((currentEndpointPage) => currentEndpointPage + 1);
  };

  const isFetchError = errorCode !== undefined || fetchFailed;

  return (
    <PinsBoardDisplay
      pinThumbnails={pinThumbnails}
      labels={labels}
      isFetching={isFetching}
      isFetchError={isFetchError}
      handleFetchMoreThumbnails={fetchNextPinThumbnailsAndFallBack}
    />
  );
};

export default PinsBoardClient;

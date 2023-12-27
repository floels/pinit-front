"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { API_ROUTE_CREATE_PIN } from "@/lib/constants";
import { toast } from "react-toastify";
import SuccessToastMessage from "./SuccessToastMessage";
import PinCreationView from "./PinCreationView";

const SUCCESS_TOAST_MIN_WIDTH = "380px";

const PinCreationViewContainer = () => {
  const t = useTranslations("PinCreation");
  const translatedConnectionErrorMessage =
    useTranslations("Common")("CONNECTION_ERROR");

  const [pinImageFile, setPinImageFile] = useState<File | null>(null);
  const [imagePreviewURL, setImagePreviewURL] = useState<string | null>(null);
  const [pinDetails, setPinDetails] = useState({ title: "", description: "" });
  const [isPosting, setIsPosting] = useState(false);

  const hasDroppedFile = !!pinImageFile;

  const handleFileDropped = (file: File) => {
    setPinImageFile(file);

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setImagePreviewURL(fileReader.result as string);
    };

    fileReader.readAsDataURL(file);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    const newPinDetails = { ...pinDetails, [name]: value };
    setPinDetails(newPinDetails);
  };

  const resetForm = () => {
    setPinImageFile(null);
    setImagePreviewURL(null);
    setPinDetails({ title: "", description: "" });
  };

  const displayPinCreationErrorToast = () => {
    toast.warn(t("ERROR_POSTING_PIN"), {
      toastId: "toast-pin-creation-error",
    });
  };

  const displaySuccessToast = ({ pinId }: { pinId: string }) => {
    toast.success(() => <SuccessToastMessage pinId={pinId} />, {
      position: "bottom-center",
      toastId: "pin-creation-success",
      style: { minWidth: SUCCESS_TOAST_MIN_WIDTH },
    });
  };

  const postFormData = async (formData: FormData) => {
    let response;

    try {
      response = await fetch(API_ROUTE_CREATE_PIN, {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      toast.warn(translatedConnectionErrorMessage, {
        toastId: "toast-pin-creation-connection-error",
      });
      return;
    } finally {
      setIsPosting(false);
    }

    if (!response.ok) {
      displayPinCreationErrorToast();
      return;
    }

    let responseData;

    try {
      responseData = await response.json();
    } catch (error) {
      displayPinCreationErrorToast();
      return;
    }

    displaySuccessToast({ pinId: responseData.pin_id });

    resetForm();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    if (hasDroppedFile) {
      setIsPosting(true);

      formData.append("image_file", pinImageFile);
      formData.append("title", pinDetails.title);
      formData.append("description", pinDetails.description);

      postFormData(formData);
    }
  };

  return (
    <PinCreationView
      hasDroppedFile={hasDroppedFile}
      imagePreviewURL={imagePreviewURL}
      pinDetails={pinDetails}
      isPosting={isPosting}
      handleFileDropped={handleFileDropped}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default PinCreationViewContainer;

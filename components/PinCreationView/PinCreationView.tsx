"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import PinImageDropzone from "./PinImageDropzone";
import styles from "./PinCreationView.module.css";
import { API_ROUTE_CREATE_PIN } from "@/lib/constants";

const PinCreationView = () => {
  const t = useTranslations("PinCreation");

  const [pinImageFile, setPinImageFile] = useState<File | null>(null);
  const [pinDetails, setPinDetails] = useState({ title: "", description: "" });
  const [isPosting, setIsPosting] = useState(false);

  const handleFileAdded = (newFile: File) => {
    setPinImageFile(newFile);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    const newPinDetails = { ...pinDetails, [name]: value };
    setPinDetails(newPinDetails);
  };

  const hasDroppedFile = !!pinImageFile;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    if (hasDroppedFile) {
      setIsPosting(true);

      formData.append("imageFile", pinImageFile);
      formData.append("title", pinDetails.title);
      formData.append("description", pinDetails.description);

      let response;

      try {
        response = await fetch(API_ROUTE_CREATE_PIN, {
          method: "POST",
          body: formData,
        });
      } catch (error) {
        // TODO: toast.warn()
        return;
      } finally {
        setIsPosting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.headerAndSubmitButton}>
        <h1 className={styles.header}>{t("CREATE_PIN")}</h1>
        {hasDroppedFile && (
          <button
            type="submit"
            disabled={!hasDroppedFile}
            className={styles.submitButton}
            data-testid="pin-creation-submit-button"
          >
            {t("PUBLISH")}
          </button>
        )}
      </div>
      <div className={styles.formInputs}>
        <section>
          <PinImageDropzone onFileAdded={handleFileAdded} />
        </section>
        <section className={styles.pinDetailsInputsContainer}>
          <div className={styles.titleLabelAndInput}>
            <label htmlFor="title" className={styles.label}>
              {t("LABEL_TITLE")}
            </label>
            <input
              type="text"
              name="title"
              value={pinDetails.title}
              placeholder={t("PLACEHOLDER_TITLE")}
              onChange={handleInputChange}
              disabled={!hasDroppedFile}
              className={styles.titleInput}
              data-testid="pin-creation-title-input"
            />
          </div>
          <div>
            <label htmlFor="description" className={styles.label}>
              {t("LABEL_DESCRIPTION")}
            </label>
            <textarea
              name="description"
              value={pinDetails.description}
              placeholder={t("PLACEHOLDER_DESCRIPTION")}
              onChange={handleInputChange}
              disabled={!hasDroppedFile}
              className={styles.descriptionTextArea}
              data-testid="pin-creation-description-textarea"
            />
          </div>
        </section>
      </div>
    </form>
  );
};

export default PinCreationView;

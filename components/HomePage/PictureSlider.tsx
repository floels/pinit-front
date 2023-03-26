import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import styles from "./PictureSlider.module.css";

type TopicsType = "FOOD" | "HOME" | "OUTFIT" | "GARDENING";

const TOPICS: TopicsType[] = ["FOOD", "HOME", "OUTFIT", "GARDENING"];

type TopicColorsType = {
  FOOD: string;
  HOME: string;
  OUTFIT: string;
  GARDENING: string;
};

type PictureSliderProps = {
  onCarretClick: () => void;
};

type PictureSliderState = {
  previousStep: number | null;
  currentStep: number;
  timeSinceLastStepChange: number;
};

const TOPIC_COLORS: TopicColorsType = {
  FOOD: "rgb(194, 139, 0)",
  HOME: "rgb(97, 140, 123)",
  OUTFIT: "rgb(0, 118, 211)",
  GARDENING: "rgb(64, 122, 87)",
};

const TIME_BEFORE_AUTOMATIC_STEP_CHANGE_MS = 5000;
const DURATION_TRANSITION_HEADERS_MS = 500;
const DURATION_TRANSITION_IMAGES_MS = 500;
const IMAGE_FADE_LAG_UNIT_MS = 100;
const MAX_TRANSLATION_HEADERS_PX = 40;
const MAX_TRANSLATION_IMAGES_PX = 40;
const TIMER_TIME_STEP_MS = 10;

const renderSliderImage = (
  topicIndex: number,
  imageNumber: number,
  state: PictureSliderState
) => {
  const { timeSinceLastStepChange, currentStep, previousStep } = state;

  const laggedTimeSinceLastStepChange =
    timeSinceLastStepChange - (imageNumber - 1) * IMAGE_FADE_LAG_UNIT_MS;

  const fadePercentage = Math.max(
    0,
    Math.min(1, laggedTimeSinceLastStepChange / DURATION_TRANSITION_IMAGES_MS)
  );

  let opacity = 0;

  if (topicIndex === currentStep - 1) {
    // topic is currently active
    opacity = fadePercentage;
  } else if (previousStep && topicIndex === previousStep - 1) {
    // topic was active previously
    opacity = 1 - fadePercentage;
  }

  let yTranslationPx = MAX_TRANSLATION_IMAGES_PX;

  if (topicIndex === currentStep - 1) {
    // topic is currently active
    yTranslationPx = (1 - fadePercentage) * MAX_TRANSLATION_IMAGES_PX;
  } else if (previousStep && topicIndex === previousStep - 1) {
    // topic was active previously
    yTranslationPx = -fadePercentage * MAX_TRANSLATION_IMAGES_PX;
  }

  return (
    <Image
      src={`/images/landing/landing_${TOPICS[
        topicIndex
      ].toLowerCase()}_${imageNumber.toString().padStart(2, "0")}.jpeg`}
      alt={TOPICS[topicIndex]}
      width={236}
      height={350}
      className={styles.picture}
      style={{ opacity, transform: `translateY(${yTranslationPx}px)` }}
    />
  );
};

const PictureSlider = ({ onCarretClick }: PictureSliderProps) => {
  const intl = useIntl();

  const [state, setState] = useState<PictureSliderState>({
    previousStep: null,
    currentStep: 1,
    timeSinceLastStepChange: 0,
  });

  useEffect(() => {
    // Start the timer when the component mounts
    const timerId = setInterval(() => {
      setState((prevState) => {
        const newTimeSinceLastStepChange =
          prevState.timeSinceLastStepChange + TIMER_TIME_STEP_MS;
        if (
          newTimeSinceLastStepChange >= TIME_BEFORE_AUTOMATIC_STEP_CHANGE_MS
        ) {
          return {
            previousStep: prevState.currentStep,
            currentStep:
              prevState.currentStep === 4 ? 1 : prevState.currentStep + 1,
            timeSinceLastStepChange: 0,
          };
        }
        return {
          ...prevState,
          timeSinceLastStepChange: newTimeSinceLastStepChange,
        };
      });
    }, TIMER_TIME_STEP_MS);

    // Stop the timer when the component unmounts
    return () => clearInterval(timerId);
  }, []);

  const moveToStep = (newStep: number) => {
    setState({
      previousStep: state.currentStep,
      currentStep: newStep,
      timeSinceLastStepChange: 0,
    });
  };

  const computeHeaderTranslatePx = (index: number) => {
    if (index === state.currentStep - 1) {
      // Header of active step: move up linearly to the middle
      if (state.timeSinceLastStepChange > DURATION_TRANSITION_HEADERS_MS) {
        return 0;
      }
      return (
        MAX_TRANSLATION_HEADERS_PX *
        (1 - state.timeSinceLastStepChange / DURATION_TRANSITION_HEADERS_MS)
      );
    }

    if (state.previousStep && index === state.previousStep - 1) {
      // Header of previously active step: move up linearly to the top
      if (state.timeSinceLastStepChange > DURATION_TRANSITION_HEADERS_MS) {
        return MAX_TRANSLATION_HEADERS_PX;
      }
      return (
        -MAX_TRANSLATION_HEADERS_PX *
        (state.timeSinceLastStepChange / DURATION_TRANSITION_HEADERS_MS)
      );
    }

    return MAX_TRANSLATION_HEADERS_PX;
  };

  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        <div className={styles.headerAndStepper}>
          <div className={styles.headersContainer}>
            <p className={styles.headerFixedSentence}>
              {intl.formatMessage({ id: "GET_YOUR_NEXT" })}
            </p>
            <div className={styles.topicHeadersContainer}>
              {TOPICS.map((topic, index) => (
                <p
                  key={`header-${topic.toLowerCase()}`}
                  className={`${styles.topicHeader} ${
                    index === state.currentStep - 1
                      ? styles.topicHeaderActive
                      : ""
                  }`}
                  style={{
                    color: TOPIC_COLORS[topic],
                    transform: `translateY(${computeHeaderTranslatePx(
                      index
                    )}px)`,
                  }}
                >
                  {intl.formatMessage({ id: `HEADER_${topic}` })}
                </p>
              ))}
            </div>
          </div>
          <ul className={styles.stepper}>
            {TOPICS.map((topic, index) => (
              <li
                key={`stepper-button-${index + 1}`}
                className={styles.stepperListItem}
              >
                <button
                  onClick={() => {
                    moveToStep(index + 1);
                  }}
                  className={styles.stepperButton}
                  style={
                    index === state.currentStep - 1
                      ? { backgroundColor: TOPIC_COLORS[topic] }
                      : {}
                  }
                />
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.picturesContainer}>
          {TOPICS.map((topic, index) => (
            <div
              key={`pictures-container-${topic.toLowerCase()}`}
              className={styles.topicPicturesContainer}
            >
              <div className={styles.picturesColumn}>
                {renderSliderImage(index, 1, state)}
                {renderSliderImage(index, 2, state)}
              </div>
              <div
                className={styles.picturesColumn}
                style={{ paddingTop: 120 }}
              >
                {renderSliderImage(index, 3, state)}
                {renderSliderImage(index, 4, state)}
              </div>
              <div
                className={styles.picturesColumn}
                style={{ paddingTop: 200 }}
              >
                {renderSliderImage(index, 5, state)}
                {renderSliderImage(index, 6, state)}
              </div>
              <div
                className={styles.picturesColumn}
                style={{ paddingTop: 360 }}
              >
                {renderSliderImage(index, 7, state)}
              </div>
              <div
                className={styles.picturesColumn}
                style={{ paddingTop: 200 }}
              >
                {renderSliderImage(index, 8, state)}
                {renderSliderImage(index, 9, state)}
              </div>
              <div
                className={styles.picturesColumn}
                style={{ paddingTop: 120 }}
              >
                {renderSliderImage(index, 10, state)}
                {renderSliderImage(index, 11, state)}
              </div>
              <div className={styles.picturesColumn}>
                {renderSliderImage(index, 12, state)}
                {renderSliderImage(index, 13, state)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footerCarretAndBlur}>
        <div
          className={styles.carret}
          style={{
            backgroundColor: TOPIC_COLORS[TOPICS[state.currentStep - 1]],
          }}
          onClick={onCarretClick}
        >
          <FontAwesomeIcon
            icon={faAngleDown}
            className={styles.carretIcon}
            size="2x"
          />
        </div>
        <div className={styles.footer}>
          <div className={styles.footerTextAndIcon}>
            {intl.formatMessage({ id: "HOW_IT_WORKS" })}
            <FontAwesomeIcon icon={faAngleDown} className={styles.footerIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PictureSlider;

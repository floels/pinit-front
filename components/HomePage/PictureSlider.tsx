import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import styles from "./PictureSlider.module.css";
import PictureSliderPicture from "./PictureSliderPicture";

type TopicsType = "FOOD" | "HOME" | "OUTFIT" | "GARDENING";

export const PICTURE_SLIDER_TOPICS: TopicsType[] = ["FOOD", "HOME", "OUTFIT", "GARDENING"];

type TopicColorsType = {
  FOOD: string;
  HOME: string;
  OUTFIT: string;
  GARDENING: string;
};

type PictureSliderProps = {
  onClickSeeBelow: () => void;
  labels: { [key: string]: string };
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
const DURATION_TRANSITION_OUT_HEADERS_MS = 1500;
const MAX_TRANSLATION_HEADERS_PX = 40;
const TIMER_TIME_STEP_MS = 100;

const PictureSlider = ({ onClickSeeBelow, labels }: PictureSliderProps) => {
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
    return () => {
      clearInterval(timerId);
    };
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
      // Header of active step: put at the middle
      return 0;
    }

    if (state.previousStep && index === state.previousStep - 1) {
      // Header of previously active step: put at the the top until DURATION_TRANSITION_HEADERS_MS has elapsed
      if (state.timeSinceLastStepChange < DURATION_TRANSITION_OUT_HEADERS_MS) {
        return -MAX_TRANSLATION_HEADERS_PX;
      }
    }

    // None of the above: put down
    return MAX_TRANSLATION_HEADERS_PX;
  };

  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        <div className={styles.headerAndStepper}>
          <div className={styles.headersContainer}>
            <p className={styles.headerFixedSentence}>{labels.GET_YOUR_NEXT}</p>
            <div className={styles.topicHeadersContainer}>
              {PICTURE_SLIDER_TOPICS.map((topic, index) => (
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
                  {labels[`HEADER_${topic}`]}
                </p>
              ))}
            </div>
          </div>
          <ul className={styles.stepper}>
            {PICTURE_SLIDER_TOPICS.map((topic, index) => (
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
          {PICTURE_SLIDER_TOPICS.map((topic, index) => {
            const partialPictureProps = { ...state, topicIndex: index };

            return (<div
                key={`pictures-container-${topic.toLowerCase()}`}
                className={styles.topicPicturesContainer}
              >
                <div className={styles.picturesColumn}>
                  <PictureSliderPicture {...partialPictureProps} imageIndex={0} />
                  <PictureSliderPicture {...partialPictureProps} imageIndex={1} />
                </div>
                <div
                  className={styles.picturesColumn}
                  style={{ paddingTop: 120 }}
                >
                  <PictureSliderPicture {...partialPictureProps} imageIndex={2} />
                  <PictureSliderPicture {...partialPictureProps} imageIndex={3} />
                </div>
                <div
                  className={styles.picturesColumn}
                  style={{ paddingTop: 200 }}
                >
                  <PictureSliderPicture {...partialPictureProps} imageIndex={4} />
                  <PictureSliderPicture {...partialPictureProps} imageIndex={5} />
                </div>
                <div
                  className={styles.picturesColumn}
                  style={{ paddingTop: 360 }}
                >
                  <PictureSliderPicture {...partialPictureProps} imageIndex={6} />
                </div>
                <div
                  className={styles.picturesColumn}
                  style={{ paddingTop: 200 }}
                >
                  <PictureSliderPicture {...partialPictureProps} imageIndex={7} />
                  <PictureSliderPicture {...partialPictureProps} imageIndex={8} />
                </div>
                <div
                  className={styles.picturesColumn}
                  style={{ paddingTop: 120 }}
                >
                  <PictureSliderPicture {...partialPictureProps} imageIndex={9} />
                  <PictureSliderPicture {...partialPictureProps} imageIndex={10} />
                </div>
                <div className={styles.picturesColumn}>
                  <PictureSliderPicture {...partialPictureProps} imageIndex={11} />
                  <PictureSliderPicture {...partialPictureProps} imageIndex={12} />
                </div>
              </div>
            );
          }
        )}
        </div>
      </div>
      <div className={styles.footerCarretAndBlur}>
        <div
          className={styles.carret}
          style={{
            backgroundColor: TOPIC_COLORS[PICTURE_SLIDER_TOPICS[state.currentStep - 1]],
          }}
          onClick={onClickSeeBelow}
          data-testid="picture-slider-carret"
        >
          <FontAwesomeIcon
            icon={faAngleDown}
            className={styles.carretIcon}
            size="2x"
          />
        </div>
        <div className={styles.footer} onClick={onClickSeeBelow}>
          <div className={styles.footerTextAndIcon}>
            {labels.HOW_IT_WORKS}
            <FontAwesomeIcon icon={faAngleDown} className={styles.footerIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PictureSlider;

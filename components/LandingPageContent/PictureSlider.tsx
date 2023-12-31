import _ from "lodash";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import styles from "./PictureSlider.module.css";
import PictureSliderPicture from "./PictureSliderPicture";

export enum TopicsType {
  FOOD = "FOOD",
  HOME = "HOME",
  OUTFIT = "OUTFIT",
  GARDENING = "GARDENING",
}

export const PICTURE_SLIDER_TOPICS: TopicsType[] = [
  TopicsType.FOOD,
  TopicsType.HOME,
  TopicsType.OUTFIT,
  TopicsType.GARDENING,
];

type PictureSliderProps = {
  onClickSeeBelow: () => void;
};

type PictureSliderState = {
  previousStep: number | null;
  currentStep: number;
  timeSinceLastStepChange: number;
};

export const TIME_BEFORE_AUTOMATIC_STEP_CHANGE_MS = 5000;
const DURATION_TRANSITION_OUT_HEADERS_MS = 1500;
export const TIMER_TIME_STEP_MS = 50;

const computeHeaderClasses = ({
  topic,
  topicIndex,
  currentStep,
  previousStep,
  timeSinceLastStepChange,
}: {
  topic: TopicsType;
  topicIndex: number;
  currentStep: number;
  previousStep: number | null;
  timeSinceLastStepChange: number;
}) => {
  const isHeaderOfCurrentStep = topicIndex === currentStep - 1; // '-1' because
  // 'topicIndex' is zero-based, while 'currentStep' is one-based

  const isHeaderOfPreviousStep =
    previousStep && topicIndex === previousStep - 1;

  const defaultClasses = `${styles.topicHeader} ${
    styles[`topicHeader${_.capitalize(topic)}`]
  }`; // e.g. "topicHeader topicHeaderFood"

  if (isHeaderOfCurrentStep) {
    return `${defaultClasses} ${styles.topicHeaderVisible} ${styles.topicHeaderCenterPosition}`;
  }

  if (
    isHeaderOfPreviousStep &&
    timeSinceLastStepChange < DURATION_TRANSITION_OUT_HEADERS_MS
  ) {
    return `${defaultClasses} ${styles.topicHeaderTopPosition}`;
  }

  return defaultClasses;
};

const computeStepperButtonClasses = ({
  stepperButtonIndex,
  currentStep,
}: {
  stepperButtonIndex: number;
  currentStep: number;
}) => {
  const isStepperButtonOfCurrentStep = stepperButtonIndex === currentStep - 1; // '-1' because
  // 'stepperButtonIndex' is zero-based, while 'currentStep' is one-based

  const correspondingTopic = PICTURE_SLIDER_TOPICS[stepperButtonIndex];

  const defaultClasses = `${styles.stepperButton} ${
    styles[`stepperButton${_.capitalize(correspondingTopic)}`]
  }`; // e.g. "stepperButton stepperButtonFood"

  if (isStepperButtonOfCurrentStep) {
    return `${defaultClasses} ${styles.stepperButtonActive}`;
  }

  return defaultClasses;
};

const computeCarretClasses = ({ currentStep }: { currentStep: number }) => {
  const activeTopic = PICTURE_SLIDER_TOPICS[currentStep - 1];

  return `${styles.carret} ${styles[`carret${_.capitalize(activeTopic)}`]}`;
};

const PictureSlider = ({ onClickSeeBelow }: PictureSliderProps) => {
  const t = useTranslations("LandingPageContent");

  const [state, setState] = useState<PictureSliderState>({
    previousStep: null,
    currentStep: 1,
    timeSinceLastStepChange: 0,
  });

  useEffect(() => {
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

  const topicHeaders = PICTURE_SLIDER_TOPICS.map((topic, topicIndex) => {
    const classes = computeHeaderClasses({
      topic,
      topicIndex,
      ...state,
    });

    return (
      <p key={`header-${topic.toLowerCase()}`} className={classes}>
        {t(`PictureSlider.HEADER_${topic}`)}
      </p>
    );
  });

  const stepperButtons = PICTURE_SLIDER_TOPICS.map((_, stepperButtonIndex) => {
    const classes = computeStepperButtonClasses({
      stepperButtonIndex,
      currentStep: state.currentStep,
    });

    return (
      <li
        key={`stepper-button-${stepperButtonIndex}`}
        className={styles.stepperListItem}
      >
        <button
          onClick={() => {
            moveToStep(stepperButtonIndex + 1);
          }}
          className={classes}
          data-testid={`stepper-button-${stepperButtonIndex}`}
        />
      </li>
    );
  });

  const carretClasses = computeCarretClasses({
    currentStep: state.currentStep,
  });

  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        <div className={styles.headerAndStepper}>
          <div className={styles.headersContainer}>
            <p className={styles.headerFixedSentence}>
              {t("PictureSlider.GET_YOUR_NEXT")}
            </p>
            <div className={styles.topicHeadersContainer}>{topicHeaders}</div>
          </div>
          <ul className={styles.stepper}>{stepperButtons}</ul>
        </div>
        <div className={styles.picturesContainer}>
          {PICTURE_SLIDER_TOPICS.map((topic, index) => {
            const commonPictureProps = { ...state, topicIndex: index };

            return (
              <div
                key={`pictures-container-${topic.toLowerCase()}`}
                className={styles.topicPicturesContainer}
              >
                <div className={styles.picturesColumn}>
                  <PictureSliderPicture
                    {...commonPictureProps}
                    imageIndex={0}
                  />
                  <PictureSliderPicture
                    {...commonPictureProps}
                    imageIndex={1}
                  />
                </div>
                <div
                  className={styles.picturesColumn}
                  style={{ paddingTop: 120 }}
                >
                  <PictureSliderPicture
                    {...commonPictureProps}
                    imageIndex={2}
                  />
                  <PictureSliderPicture
                    {...commonPictureProps}
                    imageIndex={3}
                  />
                </div>
                <div
                  className={styles.picturesColumn}
                  style={{ paddingTop: 200 }}
                >
                  <PictureSliderPicture
                    {...commonPictureProps}
                    imageIndex={4}
                  />
                  <PictureSliderPicture
                    {...commonPictureProps}
                    imageIndex={5}
                  />
                </div>
                <div
                  className={styles.picturesColumn}
                  style={{ paddingTop: 360 }}
                >
                  <PictureSliderPicture
                    {...commonPictureProps}
                    imageIndex={6}
                  />
                </div>
                <div
                  className={styles.picturesColumn}
                  style={{ paddingTop: 200 }}
                >
                  <PictureSliderPicture
                    {...commonPictureProps}
                    imageIndex={7}
                  />
                  <PictureSliderPicture
                    {...commonPictureProps}
                    imageIndex={8}
                  />
                </div>
                <div
                  className={styles.picturesColumn}
                  style={{ paddingTop: 120 }}
                >
                  <PictureSliderPicture
                    {...commonPictureProps}
                    imageIndex={9}
                  />
                  <PictureSliderPicture
                    {...commonPictureProps}
                    imageIndex={10}
                  />
                </div>
                <div className={styles.picturesColumn}>
                  <PictureSliderPicture
                    {...commonPictureProps}
                    imageIndex={11}
                  />
                  <PictureSliderPicture
                    {...commonPictureProps}
                    imageIndex={12}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.footerCarretAndBlur}>
        <div
          className={carretClasses}
          onClick={onClickSeeBelow}
          data-testid="picture-slider-carret"
        >
          <FontAwesomeIcon
            icon={faAngleDown}
            className={styles.carretIcon}
            size="2x"
            data-testid="picture-slider-carret-icon"
          />
        </div>
        <div className={styles.footer} onClick={onClickSeeBelow}>
          <div className={styles.footerTextAndIcon}>
            {t("PictureSlider.HOW_IT_WORKS")}
            <FontAwesomeIcon icon={faAngleDown} className={styles.footerIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PictureSlider;

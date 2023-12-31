// Exceptionnally for this component, we take an "integration test" approach instead of a
// "unit test" approach, meaning we assume the behavior of child element <PictureSliderPicture />.
// This is because of the very narrow integration between <PictureSlider /> and <PictureSliderPictures />:
// they don't really make sense as separate components.
// This allows us to express assertions which are closer to what the user actually sees.

import { act, render, screen } from "@testing-library/react";
import PictureSlider, {
  PICTURE_SLIDER_TOPICS,
  TIMER_TIME_STEP_MS,
  TIME_BEFORE_AUTOMATIC_STEP_CHANGE_MS,
} from "./PictureSlider";
import {
  IMAGE_FADE_LAG_MS,
  IMAGE_URLS,
  TRANSLATION_IMAGES_PX,
} from "./PictureSliderPicture";

const NUMBER_IMAGES_PER_TOPIC = IMAGE_URLS.FOOD.length;

const mockOnClickSeeBelow = jest.fn();

const renderComponent = () => {
  render(<PictureSlider onClickSeeBelow={mockOnClickSeeBelow} />);
};

jest.useFakeTimers();

afterEach(() => {
  jest.clearAllTimers();
});

it("after the first timer step, should show only first image of first topic in central position", async () => {
  renderComponent();

  act(() => {
    jest.advanceTimersByTime(TIMER_TIME_STEP_MS + 1);
  });

  const firstPictureFirstTopic = screen.getByTestId(
    "picture-slider-picture-food-0",
  );
  expect(firstPictureFirstTopic.style.opacity).toBe("1");
  expect(firstPictureFirstTopic.style.transform).toEqual("translateY(0px)");

  PICTURE_SLIDER_TOPICS.forEach((topic) => {
    for (let i = 0; i < NUMBER_IMAGES_PER_TOPIC; i++) {
      if (topic === "FOOD" && i === 0) continue;

      const pictureTestId = `picture-slider-picture-${topic.toLowerCase()}-${i}`;
      const picture = screen.getByTestId(pictureTestId);

      expect(picture.style.opacity).toBe("0");
    }
  });
});

it("after the first image lag interval, should show only first two images of first topic", async () => {
  renderComponent();

  act(() => {
    jest.advanceTimersByTime(IMAGE_FADE_LAG_MS + TIMER_TIME_STEP_MS);
  });

  const firstPictureFirstTopic = screen.getByTestId(
    "picture-slider-picture-food-0",
  );
  expect(firstPictureFirstTopic.style.opacity).toBe("1");

  const secondPictureFirstTopic = screen.getByTestId(
    "picture-slider-picture-food-1",
  );
  expect(secondPictureFirstTopic.style.opacity).toBe("1");
  expect(secondPictureFirstTopic.style.transform).toEqual("translateY(0px)");

  PICTURE_SLIDER_TOPICS.forEach((topic) => {
    for (let i = 0; i < NUMBER_IMAGES_PER_TOPIC; i++) {
      if (topic === "FOOD" && i <= 1) continue;

      const pictureTestId = `picture-slider-picture-${topic.toLowerCase()}-${i}`;
      const picture = screen.getByTestId(pictureTestId);
      expect(picture.style.opacity).toBe("0");
    }
  });
});

it(`after the first automatic topic transition, should no longer show first image
of first topic, should still show second image of first topic, 
and should show first image of second topic`, async () => {
  renderComponent();

  act(() => {
    jest.advanceTimersByTime(
      TIME_BEFORE_AUTOMATIC_STEP_CHANGE_MS + TIMER_TIME_STEP_MS,
    );
  });

  const firstPictureFirstTopic = screen.getByTestId(
    "picture-slider-picture-food-0",
  );
  expect(firstPictureFirstTopic.style.opacity).toBe("0");
  expect(firstPictureFirstTopic.style.transform).toEqual(
    `translateY(${-TRANSLATION_IMAGES_PX}px)`,
  );

  const secondPictureFirstTopic = screen.getByTestId(
    "picture-slider-picture-food-1",
  );
  expect(secondPictureFirstTopic.style.opacity).toBe("1");
  expect(secondPictureFirstTopic.style.transform).toEqual("translateY(0px)");

  const secondPictureSecondTopic = screen.getByTestId(
    "picture-slider-picture-home-0",
  );
  expect(secondPictureSecondTopic.style.opacity).toBe("1");
  expect(secondPictureSecondTopic.style.transform).toEqual("translateY(0px)");
});

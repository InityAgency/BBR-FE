"use client";

import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./SlidesPerViewCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";

type PropType = {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
  oneElementPerView?: boolean;
};

const SlidesPerViewCarousel: React.FC<PropType> = (props) => {
  const { slides, options, oneElementPerView } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla_slides_per_view">
      <div className="embla__controls_slides_per_view">
        <div className="embla__buttons_slides_per_view">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        </div>
      </div>
      <div className="embla__viewport_slides_per_view" ref={emblaRef}>
        <div className="embla__container_slides_per_view">
          {slides.map((content, index) => (
            <div
              className={`embla__slide_slides_per_view ${oneElementPerView && "!flex-none !basis-full"}`}
              key={index}
            >
              {content}
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls_slides_per_view">
        <div className="embla__buttons_slides_per_view">
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </section>
  );
};

export default SlidesPerViewCarousel;

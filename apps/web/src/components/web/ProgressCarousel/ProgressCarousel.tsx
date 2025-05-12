import React, { useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./ProgressCarouselArrowButtons";

type EmblaCarouselProps = {
  slides: {
    title: string;
    description: string;
  }[];
  options?: EmblaOptionsType;
};

const ProgressCarousel: React.FC<EmblaCarouselProps> = ({
  slides,
  options,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  useEffect(() => {
    if (!emblaApi) return;
  }, [emblaApi]);

  return (
    <div className="embla flex flex-col justify-between h-full">
      <div className="embla__viewport h-full" ref={emblaRef}>
        <div className="embla__container mr-[30px]">
          {slides.map((slide, index) => (
            <div
              className="embla__slide border rounded-xl flex-none basis-[400px] 2xl:basis-[540px]"
              key={index}
            >
              <div className="embla__slide__content py-[30px] px-[32px] rounded-2xl border border-gray-200">
                <h1 className="text-[24px]">{slide.title}</h1>
                <p className="text-[16px]">{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls place-self-end mr-[30px] lg:mr-[130px]">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </div>
  );
};

export default ProgressCarousel;

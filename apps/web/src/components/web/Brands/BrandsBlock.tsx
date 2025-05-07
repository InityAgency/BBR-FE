import Image from "next/image";
import SectionLayout from "../SectionLayout";
import SlidesPerViewCarousel from "../SlidesPerViewCarousel/SlidesPerViewCarousel";

const BrandsBlock = () => {
  const Brands = ({
    brandImages,
  }: {
    brandImages: {
      imageUrl: string;
      imageAlt: string;
    }[];
  }) => {
    return (
      <div className="flex flex-wrap gap-[16px] lg:gap-[32px] justify-between items-center">
        {brandImages.map((image, index) => (
          <Image
            key={index}
            src={image.imageUrl}
            alt={image.imageAlt}
            width={230}
            height={120}
            className="place-self-center max-w-[330px] w-full h-[100px] lg:w-[230px] lg:h-[120px] 2xl:w-[300px] 2xl:h-[135px]"
          />
        ))}
      </div>
    );
  };
  const brandImages = [
    {
      imageUrl: "/brands/ritz-carlton.png",
      imageAlt: "brand-image1",
    },
    {
      imageUrl: "/brands/one-and-only.png",
      imageAlt: "brand-image2",
    },
    {
      imageUrl: "/brands/aman.png",
      imageAlt: "brand-image3",
    },
    {
      imageUrl: "/brands/recidences.png",
      imageAlt: "brand-image4",
    },
    {
      imageUrl: "/brands/buggati.png",
      imageAlt: "brand-image5",
    },
    {
      imageUrl: "/brands/baccarat.png",
      imageAlt: "brand-image6",
    },
    {
      imageUrl: "/brands/six-senses-recidences.png",
      imageAlt: "brand-image7",
    },
    {
      imageUrl: "/brands/four-seasons.png",
      imageAlt: "brand-image8",
    },
    {
      imageUrl: "/brands/stregis.png",
      imageAlt: "brand-image9",
    },
    {
      imageUrl: "/brands/bulgari.png",
      imageAlt: "brand-image10",
    },
    {
      imageUrl: "/brands/bentley.png",
      imageAlt: "brand-image11",
    },
    {
      imageUrl: "/brands/palazzo-vercase.png",
      imageAlt: "brand-image12",
    },
  ];

  // TODO: ADD MORE BRANDS INSTEAD OF DUPLICATING
  const brandSlides = [
    <Brands key={1} brandImages={brandImages} />,
    <Brands key={2} brandImages={brandImages} />,
    <Brands key={3} brandImages={brandImages} />,
  ];

  return (
    <div className="bg-tertiary bg-secondary">
      <SectionLayout>
        <SlidesPerViewCarousel slides={brandSlides} oneElementPerView />
      </SectionLayout>
    </div>
  );
};

export default BrandsBlock;

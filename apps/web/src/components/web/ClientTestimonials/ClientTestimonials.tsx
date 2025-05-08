import SlidesPerViewCarousel from "../SlidesPerViewCarousel/SlidesPerViewCarousel";
import Image from "next/image";

const ClientTestimonials = () => {
  const ClientTestimonial = ({
    sentence,
    fullName,
    position,
    imageUrl,
    imageAlt,
  }: {
    sentence: string;
    fullName: string;
    position: string;
    imageUrl: string;
    imageAlt: string;
  }) => {
    return (
      <div className="flex flex-col gap-[12px] lg:gap-[24px] bg-quaternary rounded-xl p-[12px] lg:p-[30px]">
        <Image
          src="/icons/gold-dots.svg"
          alt="gold-dots"
          width={30}
          height={30}
          className="w-[20px] h-[16px] lg:w-[30px] lg:h-[30px]"
        />
        <p className="text-[14px] lg:text-[20px]">{sentence}</p>
        <div className="flex gap-[12px]">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={52}
            height={52}
            className="w-[36px] h-[36px] lg:w-[52px] lg:h-[52px] rounded lg:rounded-xl"
          />
          <div>
            <p className="text-[14px] lg:text-[20px]">{fullName}</p>
            <p className="text-[10px] lg:text-[14px]">{position}</p>
          </div>
        </div>
      </div>
    );
  };

  const clientTestimonials = [
    <ClientTestimonial
      key={1}
      sentence="I created this platform to bring transparency and quality into the
              branded residence market. With decades of experience in review systems
              and a passion for architecture and real estate, I saw an oppor"
      fullName="Cameron Williamson"
      position="DEVELOPER"
      imageUrl="/woman-cammeron.png"
      imageAlt="client-testimonial1"
    />,
    <ClientTestimonial
      key={2}
      sentence="I created this platform to bring transparency and quality into the
              branded residence market. With decades of experience in review systems
              and a passion for architecture and real estate, I saw an oppor"
      fullName="Arlene McCoy"
      position="FOUNDER"
      imageUrl="/arlene-mc-coy.png"
      imageAlt="client-testimonial1"
    />,
    <ClientTestimonial
      key={3}
      sentence="I created this platform to bring transparency and quality into the
              branded residence market. With decades of experience in review systems
              and a passion for architecture and real estate, I saw an oppor"
      fullName="Jenny Wilson"
      position="MANAGER"
      imageUrl="/second-jenny-wilson.png"
      imageAlt="client-testimonial1"
    />,
    <ClientTestimonial
      key={4}
      sentence="I created this platform to bring transparency and quality into the
              branded residence market. With decades of experience in review systems
              and a passion for architecture and real estate, I saw an oppor"
      fullName="Patrick Fox"
      position="SALER"
      imageUrl="/robert-fox.png"
      imageAlt="client-testimonial1"
    />,
  ];
  return (
    <>
      <div className="flex flex-col gap-[10px] lg:gap-[22px] lg:w-[70%] items-center">
        <p className="text-primary text-center">WHAT PEOPLE SAY ABOUT US</p>
        <h1 className="text-[30px] lg:text-[40px] 2xl:text-[52px] text-center">
          Success Stories from Leading Developers
        </h1>
      </div>

      <SlidesPerViewCarousel slides={clientTestimonials} />
    </>
  );
};

export default ClientTestimonials;

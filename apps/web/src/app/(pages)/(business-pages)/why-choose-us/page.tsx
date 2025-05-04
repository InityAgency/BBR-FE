import ClientCommonInfoForm from "@/components/web/Forms/ClientCommonInfoForm";
import SectionLayout from "@/components/web/SectionLayout";
import SlidesPerViewCarousel from "@/components/web/SlidesPerViewCarousel/SlidesPerViewCarousel";
import WhyChooseUsTabs from "@/components/web/WhyChooseUs/WhyChooseUsTabs";
import Image from "next/image";
import Link from "next/link";

// #region TABS
const TabContent = ({
  primaryTitle,
  primaryDescription,
  secondaryTitle,
  secondaryDescription,
  imageUrl,
  imageAlt,
}: {
  primaryTitle: string;
  primaryDescription: string;
  secondaryTitle: string;
  secondaryDescription: string;
  imageUrl: string;
  imageAlt: string;
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-[32px] lg:gap-[64px] mt-[16px] lg:mt-[52px] items-center">
      <div className="flex flex-col gap-[16px] lg:gap-[36px] lg:w-[50%]">
        <div>
          <h1 className="text-black text-[20px] lg:text-[42px] !font-medium">
            {primaryTitle}
          </h1>
          <p className="text-black/60 text-[14px] lg:text-[20px]">
            {primaryDescription}
          </p>
        </div>
        <div>
          <h2 className="text-black text-[16px] lg:text-[30px] !font-medium">
            {secondaryTitle}
          </h2>
          <p className="text-black/60 text-[12px] lg:text-[16px]">
            {secondaryDescription}
          </p>
        </div>
      </div>
      <Image
        src={imageUrl}
        alt={imageAlt}
        width={800}
        height={400}
        className="lg:w-[50%]"
      />
    </div>
  );
};

const tabs = [
  {
    label: "Exclusive Focus",
    value: "exclusive-focus",
    content: (
      <TabContent
        primaryTitle="Exclusive Focus on Branded Residences"
        primaryDescription="BBR is uniquely positioned as the only platform dedicated
            exclusively to branded residences. Our sole focus is on
            luxury-branded developments, providing tailored visibility and
            positioning that general real estate platforms can’t offer."
        secondaryTitle="What This Means for You"
        secondaryDescription="Developers gain access to a platform designed to amplify luxury and
            brand-driven appeal. Your property will be part of an elite
            selection trusted by high-net-worth buyers."
        imageUrl="/why-choose-us-from-outside.png"
        imageAlt="from-outside"
      />
    ),
  },
  {
    label: "Strategic Rankings",
    value: "strategic-rankings",
    content: (
      <TabContent
        primaryTitle="Strategic Rankings for Maximum Credibility"
        primaryDescription="BBR provides developers with category-specific rankings (e.g., Best in Beach, Best in Golf) that act as third-party validation, boosting your property’s credibility in the eyes of affluent buyers."
        secondaryTitle="Why This Matters"
        secondaryDescription="Rankings elevate your development's trustworthiness and visibility, helping you stand out in a crowded marketplace. Buyers see your property as a top-tier choice, accelerating the decision-making process"
        imageUrl="/why-choose-us-from-outside.png"
        imageAlt="from-outside"
      />
    ),
  },
  {
    label: "Dedicated Marketing",
    value: "dedicated-marketing",
    content: (
      <TabContent
        primaryTitle="Dedicated Marketing and Lead Generation"
        primaryDescription="BBR offers branded residences-specific marketing strategies, including targeted SEO, PPC, and bespoke campaigns designed to attract the right buyers. Unlike broader platforms, we focus on generating high-quality leads specifically for branded residences"
        secondaryTitle="How This Benefits You"
        secondaryDescription="Gain exposure to qualified, high-net-worth leads actively seeking branded residences. Our marketing tools ensure that inquiries turn into serious buyer conversions."
        imageUrl="/why-choose-us-from-outside.png"
        imageAlt="from-outside"
      />
    ),
  },
  {
    label: "Exclusive Access",
    value: "exclusive-access",
    content: (
      <TabContent
        primaryTitle="Exclusive Access to a Network of HNWIs"
        primaryDescription="BBR opens doors to a highly specialized network of affluent, globally mobile buyers. These are individuals actively seeking high-end branded properties and who recognize the value of the brands we represent."
        secondaryTitle="What This Means for You"
        secondaryDescription="Your development is seen by buyers who have the means and intent to purchase high-value branded residences. This ensures that your marketing efforts are laser-focused on the right audience, leading to faster and more significant sales."
        imageUrl="/why-choose-us-from-outside.png"
        imageAlt="from-outside"
      />
    ),
  },
  {
    label: "Unmatched Expertise",
    value: "unmatched-expertise",
    content: (
      <TabContent
        primaryTitle="Unmatched Expertise in Branded Residences"
        primaryDescription="Our team consists of industry veterans with decades of experience in luxury real estate and branded developments. We understand what drives success in this niche market, offering strategic insights that other platforms simply cannot provide."
        secondaryTitle="Why This Matters"
        secondaryDescription="Our expertise ensures your project is positioned for maximum impact and is aligned with the latest market trends. You receive personalized guidance tailored to the unique challenges of branded residences"
        imageUrl="/why-choose-us-from-outside.png"
        imageAlt="from-outside"
      />
    ),
  },
  {
    label: "Industry Recognition",
    value: "industry-recognition",
    content: (
      <TabContent
        primaryTitle="Industry Recognition and Global Trust"
        primaryDescription="BBR is trusted by some of the world’s most prestigious luxury brands and developers. Featuring your development on BBR instantly enhances your credibility, as our platform is globally recognized as the authority in branded residences."
        secondaryTitle="What This Means for Your Development"
        secondaryDescription="Being associated with BBR elevates your project’s prestige, making it more attractive to discerning buyers. Buyers trust that properties listed on BBR are of the highest quality, accelerating visibility and creating buyer urgency."
        imageUrl="/why-choose-us-from-outside.png"
        imageAlt="from-outside"
      />
    ),
  },
  {
    label: "Dedicated Support",
    value: "dedicated-support",
    content: (
      <TabContent
        primaryTitle="Dedicated Support from Industry Experts"
        primaryDescription="BBR is more than just a listing platform—we offer hands-on support throughout your development’s journey. From personalized marketing strategy development to ongoing consultations, our team is committed to ensuring your property’s success."
        secondaryTitle="What This Means for You"
        secondaryDescription="You benefit from one-on-one support, helping you optimize your listings and strategies. Our team ensures that your development performs well across all metrics, leading to long-term success."
        imageUrl="/why-choose-us-from-outside.png"
        imageAlt="from-outside"
      />
    ),
  },
  {
    label: "A Proven Track",
    value: "a-proven-track",
    content: (
      <TabContent
        primaryTitle="A Proven Track Record of Developer Success"
        primaryDescription="BBR has a proven track record of helping developers achieve exceptional results. With data-driven strategies and targeted marketing, our developers have seen significant improvements in lead quality, sales performance, and global presence."
        secondaryTitle="Why You Should Care"
        secondaryDescription="Developers who partner with BBR consistently achieve faster sales cycles and higher visibility. Our history of success ensures that BBR will transform your development’s potential into measurable results."
        imageUrl="/why-choose-us-from-outside.png"
        imageAlt="from-outside"
      />
    ),
  },
  {
    label: "A Vision for the Future",
    value: "a-vision-for-the-future",
    content: (
      <TabContent
        primaryTitle="A Vision for the Future"
        primaryDescription="At BBR, we’re always looking ahead. We provide developers with the insights and tools they need to stay ahead of market trends, ensuring your development remains competitive as the branded residences market evolves."
        secondaryTitle="What This Means for Your Project"
        secondaryDescription="Gain access to forward-thinking strategies that keep your development relevant in a rapidly changing market. By partnering with BBR, your project is positioned for long-term success."
        imageUrl="/why-choose-us-from-outside.png"
        imageAlt="from-outside"
      />
    ),
  },
];
// #endregion

// #region CLIENTS TESTIMONIALS
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
        width={37}
        height={32}
        className="w-[20px] h-[16px] lg:w-[37px] lg:h-[32px]"
      />
      <p className="text-[14px] lg:text-[28px]">{sentence}</p>
      <div className="flex gap-[12px]">
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={52}
          height={52}
          className="w-[36px] h-[36px] lg:w-[52px] lg:h-[52px] rounded lg:rounded-xl"
        />
        <div>
          <p className="text-[14px] lg:text-[24px]">{fullName}</p>
          <p className="text-[10px] lg:text-[16px]">{position}</p>
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
// #endregion

// #region BRANDS
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
          width={330}
          height={135}
          className="place-self-center max-w-[330px] w-[180px] h-[80px] lg:w-[330px] lg:h-[135px]"
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
// #endregion

// #region MAIN COMPONENT
export default function WhyChooseUsPage() {
  return (
    <div>
      {/* FIRST SECTION */}
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-8 lg:mb-0">
        <div className="flex flex-col gap-6 w-full rounded-xl bg-black/50 p-4 lg:p-8 py-12 lg:py-[50px] relative overflow">
          <Image
            src="/why-choose-us-hero.png"
            alt="about-us"
            fill
            className="w-full h-full object-cover opacity-40"
          />
          <div className="flex flex-col xl:flex-row justify-between z-10 gap-[50px] lg:gap-[140px]">
            <div className="flex flex-col justify-center gap-[16px]">
              <p className="text-primary text-[16px]">WHY CHOOSE US</p>
              <h1 className="text-[30px] xl:text-[56px]">
                Reach Affluent Buyers Seeking Opulent Branded Residences
              </h1>
              <p className="text-[18px] lg:text-[22px]">
                Lorem ipsum dolor sit amet consectetur. Dolor auctor nunc odio
                sagittis ornare. Faucibus bibendum eget erat purus ultrices
                blandit tempus duis. Auctor ultricies ut quam elit amet quis. Mi
                interdum nisl vestibulum blandit.
              </p>
            </div>
            <div className="w-full lg:min-w-[628px]">
              <ClientCommonInfoForm />
            </div>
          </div>
        </div>
      </div>

      {/* SECOND SECTION */}
      <div className="bg-beigeVariant4">
        <SectionLayout>
          <p className="text-primary text-[20px] text-center w-full">
            WHY CHOOSE BEST BRANDED RESIDENCES?
          </p>
          <h1 className="text-[30px] xl:text-[52px] text-black place-self-center text-center lg:w-[70%]">
            Align Your Development with the Industry Leader in Luxury Branded
            Residences
          </h1>
          <div className="flex flex-col xl:flex-row bg-beigeVariant5 mt-[25px] xl:mt-[56px] rounded-2xl p-[24px] lg:p-[48px] gap-[32px]">
            <Image
              src="/why-choose-us-best.png"
              alt="why-choose-us-best"
              width={700}
              height={740}
              className="rounded-2xl w-full xl:w-[50%]"
            />

            <div className="flex flex-col justify-between gap-[20px] xl:w-[50%]">
              <div className="flex bg-beigeVariant6 p-[22px] gap-[16px] rounded-xl">
                <Image
                  src="/icons/why-choose-us-boost.svg"
                  width={40}
                  height={40}
                  alt="home-icon"
                  className="place-self-start"
                />
                <div>
                  <h2 className="text-black text-[16px] lg:text-[28px]">
                    Boost Credibility & Trust
                  </h2>
                  <p className="text-black/80 text-[12px] lg:text-[20px]">
                    Enhance your property’s reputation with strategic rankings,
                    giving your development the credibility needed to convert
                    more leads into buyers.
                  </p>
                </div>
              </div>
              <div className="flex bg-beigeVariant6 p-[22px] gap-[16px] rounded-xl">
                <Image
                  src="/icons/why-choose-us-stand-out.svg"
                  width={40}
                  height={40}
                  alt="home-icon"
                  className="place-self-start"
                />
                <div>
                  <h2 className="text-black text-[16px] lg:text-[28px]">
                    Stand Out with Global Rankings
                  </h2>
                  <p className="text-black/80 text-[12px] lg:text-[20px]">
                    Gain higher visibility through our platform’s ranking
                    system, positioning your property for premium exposure and
                    trust with buyers.
                  </p>
                </div>
              </div>

              <div className="flex bg-beigeVariant6 p-[22px] gap-[16px] rounded-xl">
                <Image
                  src="/icons/why-choose-us-elevate.svg"
                  width={40}
                  height={40}
                  alt="home-icon"
                  className="place-self-start"
                />
                <div>
                  <h2 className="text-black text-[16px] lg:text-[28px]">
                    Elevate Your Property's Value
                  </h2>
                  <p className="text-black/80 text-[12px] lg:text-[20px]">
                    Secure premium pricing and greater demand by aligning with
                    our ranking system, driving unmatched visibility and
                    credibility for your property.
                  </p>
                </div>
              </div>

              <div className="flex bg-beigeVariant6 p-[22px] gap-[16px] rounded-xl">
                <Image
                  src="/icons/why-choose-us-expand.svg"
                  width={40}
                  height={40}
                  alt="home-icon"
                  className="place-self-start"
                />
                <div>
                  <h2 className="text-black text-[16px] lg:text-[28px]">
                    Expand Global Reach
                  </h2>
                  <p className="text-black/80 text-[12px] lg:text-[20px]">
                    SAccess a worldwide network of affluent buyers, positioning
                    your property for international visibility and higher sales
                    velocity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* THIRD SECTION */}
      <div className="flex flex-col gap-[56px] bg-beigeVariant8 border-3 border-beigeVariant7">
        <SectionLayout>
          <div className="flex flex-col xl:flex-row gap-[30px] xl:gap-[100px]">
            <div className="w-full xl:w-[50%]">
              <p className="text-primary text-center">WHY THEY CHOOSE US</p>
              <h1 className="text-[30px] xl:text-[52px] w-full text-center xl:text-start text-black">
                Why Developers Choose BBRA Strategic Necessity
              </h1>
            </div>
            <p className="text-black/70 text-[20px] xl:w-[50%]">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when anLorem Ipsum is simply dummy text of
              the printing and typesetting industLorem Ipsum is simply dummy
              text of the printing and typesetting industry. Lorem Ipsum has
              been the industry's standard dummy text ever since the 1500s, when
              anLorem Ipsum is simply dummy text of the printing and typesetting
              indust
            </p>
          </div>
          <Image
            src="/living-room-view.png"
            alt="living-room-view"
            width={1680}
            height={400}
            className="rounded-2xl w-full"
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 grid-rows-2">
            <div className="flex bg-beigeVariant6 p-[22px] gap-[16px] lg:border-r-3 lg:border-beigeVariant5 lg:mb-10">
              <div className="flex w-[60px] h-[60px] bg-beigeVariant4 rounded-xl justify-center items-center">
                <p className="w-[60px] text-center bg-beigeVariant4 text-primary font-bold text-[28px]">
                  1
                </p>
              </div>
              <div>
                <h2 className="text-black text-[28px]">
                  Stand Out with Global Rankings
                </h2>
                <p className="text-black/80 text-[20px]">
                  Gain higher visibility through our platform’s ranking system,
                  positioning your property for premium exposure and trust with
                  buyers.
                </p>
              </div>
            </div>

            <div className="flex bg-beigeVariant6 p-[22px] gap-[16px] lg:border-r-3 lg:border-beigeVariant5">
              <div className="flex w-[60px] h-[60px] bg-beigeVariant4 rounded-xl justify-center items-center ">
                <p className="w-[60px] text-center  bg-beigeVariant4 rounded-xl text-primary font-bold text-[28px]">
                  2
                </p>
              </div>
              <div>
                <h2 className="text-black text-[28px]">Maximized ROI</h2>
                <p className="text-black/80 text-[20px]">
                  Our developers consistently achieve premium pricing and
                  reduced marketing costs, resulting in a higher return on
                  investment.
                </p>
              </div>
            </div>

            <div className="flex bg-beigeVariant6 p-[22px] gap-[16px] rounded-xl">
              <div className="flex w-[60px] h-[60px] bg-beigeVariant4 rounded-xl justify-center items-center">
                <p className="w-[60px] text-center  bg-beigeVariant4 rounded-xl text-primary font-bold text-[28px]">
                  3
                </p>
              </div>
              <div>
                <h2 className="text-black text-[28px]">Thought Leadership</h2>
                <p className="text-black/80 text-[20px]">
                  Align with BBR to stay ahead of industry trends, future-proof
                  your developments, and build long-term market resilience.
                </p>
              </div>
            </div>

            <div className="flex bg-beigeVariant6 p-[22px] gap-[16px] lg:border-r-3 lg:border-beigeVariant5">
              <div className="flex w-[60px] h-[60px] bg-beigeVariant4 rounded-xl justify-center items-center">
                <p className="w-[60px] text-center  bg-beigeVariant4 rounded-xl text-primary font-bold text-[28px]">
                  4
                </p>
              </div>
              <div>
                <h2 className="text-black text-[28px]">
                  Future-Proofing Your Brand
                </h2>
                <p className="text-black/80 text-[20px]">
                  By aligning with BBR, developers position themselves to
                  succeed not just today, but in the future. Our team
                  continually monitors market
                </p>
              </div>
            </div>

            <div className="flex bg-beigeVariant6 p-[22px] gap-[16px] rounded-xl">
              <div className="flex w-[60px] h-[60px] bg-beigeVariant4 rounded-xl justify-center items-center">
                <p className="w-[60px] text-center  bg-beigeVariant4 rounded-xl text-primary font-bold text-[28px]">
                  5
                </p>
              </div>
              <div>
                <h2 className="text-black text-[28px]">
                  A Partner for the Long Term
                </h2>
                <p className="text-black/80 text-[20px]">
                  We don’t just provide a platform—we offer ongoing strategic
                  advice, ensuring that developers have the tools and expertise
                  needed for sustained growth.
                </p>
              </div>
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* FOURTH SECTION */}
      <div className="bg-beigeVariant8">
        <SectionLayout>
          <h1 className="text-black text-[30px] xl:text-[52px] text-center">
            Our Core team
          </h1>
          <p className="text-black text-[18px] text-start xl:text-center">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry
          </p>
          <div className="relative flex flex-col md:flex-row gap-[48px] mt-[20px]">
            <div className="flex flex-col gap-[10px]">
              <div className="relative flex">
                <Image
                  alt="Mountains"
                  src="/robert-fox.png"
                  quality={100}
                  height={424}
                  width={410}
                  className="rounded-xl"
                />
                <Link href="https://www.linkedin.com/">
                  <Image
                    src="/icons/linkedin-rounded.svg"
                    width={62}
                    height={62}
                    alt="home-icon"
                    className="absolute right-2 bottom-2 w-[30px] h-[30px] xl:w-[62px] xl:h-[62px]"
                  />
                </Link>
              </div>
              <h1 className="text-black text-center text-[20px] xl:text-[36px]">
                Robert Fox
              </h1>
              <p className="text-black/60 text-center text-[12px] xl:text-[20px]">
                Software Developer
              </p>
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="relative flex">
                <Image
                  alt="Mountains"
                  src="/cammeron.png"
                  quality={100}
                  height={424}
                  width={410}
                  className="rounded-xl"
                />
                <Link href="https://www.linkedin.com/">
                  <Image
                    src="/icons/linkedin-rounded.svg"
                    width={62}
                    height={62}
                    alt="home-icon"
                    className="absolute right-2 bottom-2 w-[30px] h-[30px] xl:w-[62px] xl:h-[62px]"
                  />
                </Link>
              </div>
              <h1 className="text-black text-center text-[20px] xl:text-[36px]">
                Cameron Williamson
              </h1>
              <p className="text-black/60 text-center text-[12px] xl:text-[20px]">
                President of Sales
              </p>
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="relative flex">
                <Image
                  alt="Mountains"
                  src="/jenny.png"
                  quality={100}
                  height={424}
                  width={410}
                  className="rounded-xl"
                />
                <Link href="https://www.linkedin.com/">
                  <Image
                    src="/icons/linkedin-rounded.svg"
                    width={62}
                    height={62}
                    alt="home-icon"
                    className="absolute right-2 bottom-2 w-[30px] h-[30px] xl:w-[62px] xl:h-[62px]"
                  />
                </Link>
              </div>
              <h1 className="text-black text-center text-[20px] xl:text-[36px]">
                Jenny Wilson
              </h1>
              <p className="text-black/60 text-center text-[12px] xl:text-[20px]">
                Software Tester
              </p>
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* FIFTH SECTION */}
      <div className="bg-beigeVariant8 border-3 border-beigeVariant7">
        <SectionLayout>
          <div className="flex flex-col xl:w-[50%] place-self-center">
            <p className="text-primary text-[16px] xl:text-[20px] text-center">
              WHY THEY CHOOSE US
            </p>
            <h1 className="text-black text-[32px] xl:text-[52px] text-center">
              Why Developers Choose BBRA Strategic Necessity
            </h1>
            <p className="text-black/60 text-[16px] lg:text-[20px] text-center">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever
            </p>
          </div>
          <WhyChooseUsTabs tabs={tabs} className="mt-[56px]" />
        </SectionLayout>
      </div>

      {/* SIXTH SECTION */}
      <div className="bg-beigeVariant4">
        <SectionLayout>
          <div className="relative flex flex-col gap-[16px] lg:gap-[20px] bg-beigeVariant6 rounded-xl px-[12px] py-[24px] lg:py-[66px] items-center">
            <Image
              src="/texture.png"
              alt="about-us"
              fill
              className="w-full h-full object-cover opacity-40"
            />
            <h1 className="text-black text-[24px] lg:text-[52px] lg:w-[50%] text-center">
              Join the Best and Elevate Your Branded Residence
            </h1>
            <p className="text-black text-[14px] lg:text-[18px] lg:w-[50%] text-center">
              Aligning with Best Branded Residences means partnering with the
              leading platform for luxury developments. You’ll benefit from
              exclusive access to affluent buyers, industry expertise, and a
              proven strategy for success.Partner with BBR today to take your
              branded residence to the next level of success.
            </p>
            <Link
              href="/#"
              className="z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-[40px] py-[20px] has-[>svg]:px-3 w-full lg:w-fit"
            >
              Get Started -&gt;
            </Link>
          </div>
        </SectionLayout>
      </div>

      {/* SEVENTH SECTION */}
      <div className="flex flex-col gap-[56px] bg-secondary bg-secondary items-center">
        <SectionLayout>
          <div className="flex flex-col gap-[10px] lg:gap-[22px] lg:w-[50%] items-center">
            <p className="text-primary text-center">WHAT PEOPLE SAY ABOUT US</p>
            <h1 className="text-[30px] lg:text-[52px] text-center">
              Client Testimonials
            </h1>
            <p className="text-[16px] lg:text-[22px] text-center">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industryLorem Ipsum is simply dummy text of the printing and
              typesetting industry
            </p>
          </div>

          <SlidesPerViewCarousel slides={clientTestimonials} />
        </SectionLayout>
      </div>

      {/* EIGHT SECTION */}
      <div className="bg-tertiary bg-secondary">
        <SectionLayout>
          <SlidesPerViewCarousel slides={brandSlides} oneElementPerView />
        </SectionLayout>
      </div>
    </div>
  );
}
// #endregion

import BrandSlider from "@/components/web/Brands/BrandSlider";
import FaqBlock from "@/components/web/Faq/FaqBlock";
import ClientCommonInfoForm from "@/components/web/Forms/ClientCommonInfoForm";
import SectionLayout from "@/components/web/SectionLayout";
import VerticalCarousel from "@/components/web/VerticalCarousel/VerticalCarousel";
import Image from "next/image";
import Link from "next/link";

// #region Vertical Carousel related things
const VerticalCarouselItem = ({
  title,
  description,
  imgSrc,
}: {
  title: string;
  description: string;
  imgSrc: string;
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-[15px] h-full">
      <div className="flex flex-col lg:flex-row lg:flex-row gap-[15px]">
        <Image
          src={imgSrc}
          alt="bb-score"
          width={200}
          height={140}
          className="w-full lg:max-w-[200px]"
        />
        <div className="place-self-center">
          <h2 className="text-black text-[17px]">{title}</h2>
          <p className="text-black text-[8px]">{description}</p>
          <div className="flex items-center mt-1">
            <p className="text-black mr-4 text-[8px]">View more</p>
            <p className="text-[8px] p-2 items-center justify-center rounded-sm text-sm font-medium bg-primary text-primary-foreground w-fit">
              Request information
            </p>
          </div>
        </div>
      </div>
      <Image
        src="/bbr-score-white.png"
        alt="bb-score"
        width={200}
        height={140}
        className="w-full lg:max-w-[200px]"
      />
    </div>
  );
};

const verticalCarouseItems: React.ReactNode[] = [
  <VerticalCarouselItem
    key={1}
    title="Missoni Baia Miami, Luxury Biscayne Bay Condos, Miami"
    description="Overlooking Biscayne Bay, these luxurious condos boast stunning water views, expansive outdoor spaces, and exclusive amenities like a private marina."
    imgSrc="/marketing-residence-1.png"
  />,
  <VerticalCarouselItem
    key={2}
    title="Bentley residences, Sunny Isles Beach"
    description="Overlooking Biscayne Bay, these luxurious condos boast stunning water views, expansive outdoor spaces, and exclusive amenities like a private marina."
    imgSrc="/marketing-residence-2.png"
  />,
  <VerticalCarouselItem
    key={3}
    title="Fendi Chateau Residences, Miami"
    description="Boasting breathtaking ocean views and direct beach access, this luxury residence features expansive terraces and unparalleled amenities."
    imgSrc="/marketing-residence-3.png"
  />,
];
// #endregion

const MarketingSolutionsPage = () => {
  return (
    <div>
      {/* FIRST SECTION */}
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-8 lg:mb-0">
        <div className="flex flex-col gap-6 w-full bg-secondary bg-black/50 p-4 lg:p-8 py-12 lg:py-[50px] relative overflow">
          <Image
            src="/marketing-solutions-hero.jpg"
            alt="about-us"
            fill
            className="w-full h-full object-cover opacity-40 rounded-xl"
          />
          <div className="flex flex-col xl:flex-row justify-between z-10 gap-[50px] ">
            <div className="flex flex-col justify-center gap-[16px]">
              <p className="text-primary text-[16px]">TRUSTED PLATFORM</p>
              <h1 className="text-[30px] lg:text-[42px] ">
                Reach Affluent Buyers Seeking Opulent Branded Residences
              </h1>
              <p className="text-[18px] text-white/60">
                Showcase your branded residences to affluent individuals
                actively seeking their next high-end property, helping you close
                deals faster and with confidence.
              </p>
              <div className="flex gap-[8px] place-self-start">
                <Link
                  href="/#"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit"
                >
                  Start for free
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-white/20 text-primary-foreground shadow-xs hover:bg-white/25 h-9 px-4 py-2 has-[>svg]:px-3 w-fit"
                >
                  Schedule a demo
                </Link>
              </div>
            </div>
            <div className="w-full lg:min-w-[550px]">
              <ClientCommonInfoForm />
            </div>
          </div>
        </div>
      </div>

      {/* SECOND SECTION */}
      <div className="bg-beigeVariant4">
        <SectionLayout>
          <div className="flex flex-col lg:flex-row gap-[20px]">
            <div className="flex flex-col flex-1/2">
              <p className="text-black text-primary xl:text-[18px]">
                MAXIMIZE IMPACT
              </p>
              <h1 className="text-black text-[30px] xl:text-[40px]">
                Accelerate Your Sales
              </h1>
            </div>
            <div className="flex flex-col flex-1/2 gap-[24px]">
              <p className="text-[#171D22] xl:text-[18px]">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown.
              </p>
              <div className="flex gap-[8px] place-self-start">
                <Link
                  href="/#"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit"
                >
                  Start for free
                </Link>
                <Link
                  href="/#"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-transparent text-slate-900 shadow-xs hover:bg-white/25 h-9 px-4 py-2 has-[>svg]:px-3 w-fit border-1 border-slate-300"
                >
                  Explore plans
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full">
            <div className="flex flex-1/2">
              <Image
                src="/accelerate.png"
                alt="accelerate-img"
                width={640}
                height={440}
                className="w-full"
              />
            </div>
            <div className="flex flex-col  flex-1/2 gap-[16px] my-[20px]">
              <div className="flex bg-beigeVariant6 p-[22px] gap-[16px] rounded-xl">
                <Image
                  src="/icons/accelerate-1.svg"
                  width={36}
                  height={36}
                  alt="home-icon"
                  className="place-self-start"
                />
                <div>
                  <h2 className="text-black text-[22px]">
                    Global Reach and Premium Exposure
                  </h2>
                  <p className="text-black/80 text-[16px]">
                    Showcase your luxury residences to a worldwide audience of
                    high-net-worth buyers.
                  </p>
                  <Link className="flex gap-[10px] mt-[15px]" href="/#">
                    <p className="text-primary text-[16px]">Read More</p>
                    <Image
                      src="/icons/arrow-up-right.svg"
                      alt="arrow-icon"
                      width={24}
                      height={24}
                      className="place-self-start w-[20px] h-[20px]"
                    />
                  </Link>
                </div>
              </div>

              <div className="flex bg-beigeVariant6 p-[22px] gap-[16px] rounded-xl">
                <Image
                  src="/icons/accelerate-2.svg"
                  width={36}
                  height={36}
                  alt="home-icon"
                  className="place-self-start"
                />
                <div>
                  <h2 className="text-black text-[22px]">
                    High-Quality Leads That Convert
                  </h2>
                  <p className="text-black/80 text-[16px]">
                    Drive faster sales with serious buyers seeking branded
                    residences.
                  </p>
                  <Link className="flex gap-[10px] mt-[15px]" href="/#">
                    <p className="text-primary text-[16px]">Read More</p>
                    <Image
                      src="/icons/arrow-up-right.svg"
                      alt="arrow-icon"
                      width={24}
                      height={24}
                      className="place-self-start w-[20px] h-[20px]"
                    />
                  </Link>
                </div>
              </div>

              <div className="flex bg-beigeVariant6 p-[22px] gap-[16px] rounded-xl">
                <Image
                  src="/icons/accelerate-3.svg"
                  width={36}
                  height={36}
                  alt="home-icon"
                  className="place-self-start"
                />
                <div>
                  <h2 className="text-black text-[22px]">
                    Seamless Setup with Quick Results
                  </h2>
                  <p className="text-black/80 text-[16px] ">
                    Enjoy a hassle-free setup process, supported by our
                    dedicated team.
                  </p>
                  <Link className="flex gap-[10px] mt-[15px]" href="/#">
                    <p className="text-primary text-[16px]">Read More</p>
                    <Image
                      src="/icons/arrow-up-right.svg"
                      alt="arrow-icon"
                      width={24}
                      height={24}
                      className="place-self-start w-[20px] h-[20px]"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* THIRD SECTION */}
      <div className="bg-beigeVariant6">
        <SectionLayout>
          <div className="flex flex-col gap-[30px] lg:gap-[58px]">
            <div className="flex flex-col gap-[10px] lg:w-[65%] place-self-center">
              <p className="text-primary text-center tracking-widest text-[14px] xl:text-[16px]">
                FIND YOUR FIT
              </p>
              <h1 className="text-black text-center text-[30px] lg:text-[40px]">
                Flexible Plans Tailored to Your Success
              </h1>
              <p className="text-[#4D4D4D] text-center text-[16px] lg:text-[18px]">
                Whether you're just getting started or need a fully customized
                solution, our plans are designed to help you reach affluent
                buyers and maximize results.
              </p>
              <Link
                href="/#"
                className="inline-flex place-self-center items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-4 has-[>svg]:px-3 w-fit"
              >
                Explore Our Plans & Pricing
              </Link>
            </div>
            <div className="flex flex-col lg:flex-row gap-[16px] lg:gap-[30px]">
              <div className="flex flex-1 flex-col p-[16px] lg:p-[40px] border border-primary/60 rounded-xl">
                <p className="text-[#777777] tracking-widest text-[14px] lg:text-[16px]">
                  IT'S FREE
                </p>
                <h2 className="text-black text-[24px] lg:text-[30px]">
                  Basic Plan
                </h2>
                <p className="text-[#777777] text-[16px] lg:text-[18px]">
                  Great for those who’re just starting out and have tiny teams
                </p>
              </div>
              <div className="flex flex-1 flex-col p-[16px] lg:p-[40px] bg-beigeVariant4 rounded-xl">
                <p className="text-[#777777] tracking-widest text-[14px] lg:text-[16px]">
                  SUGGESTED
                </p>
                <h2 className="text-black text-[24px] lg:text-[30px]">
                  Premium Plan
                </h2>
                <p className="text-[#777777] text-[16px] lg:text-[18px]">
                  Unlock advanced tools and dedicated support to elevate your
                  listings and drive serious leads.
                </p>
              </div>
              <div className="flex flex-1 flex-col p-[16px] lg:p-[40px] border border-primary/60 rounded-xl">
                <p className="text-[#777777] tracking-widest text-[14px] lg:text-[16px]">
                  CUSTOM
                </p>
                <h2 className="text-black text-[24px] lg:text-[30px] ">
                  Bespoke Plan
                </h2>
                <p className="text-[#777777] text-[16px] lg:text-[18px] ">
                  A personalized solution built for your unique needs, offering
                  exclusive features designed for maximum growth.
                </p>
              </div>
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* FOURTH SECTION */}
      <div className="bg-white">
        <SectionLayout>
          <div className="flex flex-col gap-[20px] lg:flex-row lg:gap-[160px]">
            <div>
              <p className="text-primary text-[14px] lg:text-[18px] tracking-widest">
                BOOST PERFORMANCE 
              </p>
              <h1 className="text-black text-[30px] lg:text-[40px] ">
                Powerful Tools for Maximum Exposure 
              </h1>
              <p className="text-[#4D4D4D] text-[16px] lg:text-[18px]">
                Discover the essential tools and features that empower
                developers to reach affluent buyers, generate qualified leads,
                and close deals faster. Whether you're listing a single property
                or managing an entire portfolio, our platform is designed to
                support your success at every step.
              </p>
            </div>
            <Link
              href="/#"
              className="place-self-start inline-flex place-self-center items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-4 has-[>svg]:px-3 w-fit"
            >
              Explore Our Solutions
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row w-full gap-[24px]">
            <div className="p-[16px] lg:p-[40px] bg-beigeVariant6 rounded-xl flex-1/3">
              <h2 className="text-black text-[22px] lg:text-[28px] ">
                Global Audience Reach
              </h2>
              <p className="text-[#4D4D4D] text-[16px] lg:text-[16px]">
                Access high-net-worth buyers worldwide.
              </p>
              <p className="text-primary text-[16px] lg:text-[16px] bg-beigeVariant4 w-fit p-[4px] lg:p-[8px] rounded mt-1 mb-1 lg:mt-4 lg:mb-2">
                100+ countries
              </p>
              <Image
                src="/countries.png"
                alt="countries"
                width={300}
                height={200}
                className="flex flex-1 w-full h-max"
              />
            </div>
            <div className="p-[16px] lg:p-[40px] bg-beigeVariant6 rounded-xl flex-2/3">
              <h2 className="text-black text-[22px] lg:text-[28px] ">
                Advanced Analytics
              </h2>
              <p className="text-[#4D4D4D] text-[16px] lg:text-[16px] ">
                Track and optimize your listings with real-time performance
                data.
              </p>

              <div className="flex flex-1 flex-col lg:flex-row mt-[16px] lg:mt-[40px] gap-[12px] lg:mx-[30px]">
                <Image
                  src="/marketing-chart-1.png"
                  alt="countries"
                  width={500}
                  height={300}
                  className="w-full"
                />
                <Image
                  src="/marketing-chart-2.png"
                  alt="countries"
                  width={450}
                  height={280}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row w-full gap-[24px]">
            <div className="flex flex-col p-[16px] lg:p-[40px] bg-beigeVariant6 rounded-xl flex-2/3">
              <h2 className="text-black text-[22px] lg:text-[28px]">
                Targeted Marketing Tools
              </h2>
              <p className="text-[#4D4D4D] text-[16px] lg:text-[16px]mb-[20px]">
                Ensure your properties are seen by the right buyers at the right
                time.
              </p>
              <VerticalCarousel items={verticalCarouseItems} />
            </div>
            <div className="p-[16px] lg:p-[40px] bg-beigeVariant6 rounded-xl flex-1/3">
              <h2 className="text-black text-[22px] lg:text-[28px]">
                Dedicated Marketing Support
              </h2>
              <p className="text-[#4D4D4D] text-[16px] lg:text-[16px]">
                Work with a marketing expert to maximize your property’s
                visibility.
              </p>

              <Image
                src="/marketing-support.png"
                alt="countries"
                width={400}
                height={400}
                className="mt-[10px] lg:mt-[30px]"
              />
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* FIFTH SECTION */}
      <div className="bg-beigeVariant4">
        <SectionLayout>
          <div className="flex flex-col gap-[10px] lg:w-[65%] place-self-center">
            <p className="text-primary text-center tracking-widest text-[14px] lg:text-[18px]]">
              WHY CHOOSE US
            </p>
            <h1 className="text-black text-center text-[30px] lg:text-[40px]">
              Why Partner With Best Branded Residences?
            </h1>
            <p className="text-[#4D4D4D] text-center text-[16px] lg:text-[18px]">
              We connect developers with a global audience of high-end buyers,
              providing premium marketing solutions that maximize exposure and
              drive sales.
            </p>
            <Link
              href="/about-us"
              className="w-[50%] lg:w-fit inline-flex place-self-center items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-4 has-[>svg]:px-3"
            >
              About Us
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-[10px] bg-beigeVariant6 rounded-xl p-[16px] lg:p-[54px] w-full">
            <div className="flex flex-col">
              <h1 className="text-[#0F172A] text-[50px] lg:text-[60px] text-center">
                95%
              </h1>
              <p className="text-[#4D4D4D] text-[16px] lg:text-[18px]  text-center">
                Our clients experience a 95% satisfaction rate
              </p>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#0F172A] text-[50px] lg:text-[60px] text-center">
                1M+
              </h1>
              <p className="text-[#4D4D4D] text-[16px] lg:text-[18px] text-center">
                Each over a million potential buyer through platform
              </p>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#0F172A] text-[50px] lg:text-[60px]  text-center">
                80+
              </h1>
              <p className="text-[#4D4D4D] text-[16px] lg:text-[18px] text-center">
                Showcasing luxury residences in over 80 countries
              </p>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#0F172A] text-[50px] lg:text-[60px]  text-center">
                80+
              </h1>
              <p className="text-[#4D4D4D] text-[16px] lg:text-[18px] text-center">
                Showcasing luxury residences in over 80 countries
              </p>
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* SIXTH SECTION */}
      <FaqBlock themeLight />

      {/* SEVENTH SECTION */}
      <BrandSlider />
    </div>
  );
};

export default MarketingSolutionsPage;

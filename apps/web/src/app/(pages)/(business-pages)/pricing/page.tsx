import FaqBlock from "@/components/web/Faq/FaqBlock";
import ClientCommonInfoForm from "@/components/web/Forms/ClientCommonInfoForm";
import PlanOverview from "@/components/web/PlanOverview/PlanOverview";
import SectionLayout from "@/components/web/SectionLayout";
import Image from "next/image";
import Link from "next/link";

const PricingPage = () => {
  return (
    <div>
      {/* FIRST SECTION */}
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-8 lg:mb-10">
        <div className="flex flex-col gap-6 w-full bg-secondary bg-black/50 p-4 lg:p-8 py-12 lg:py-[50px] relative overflow">
          <Image
            src="/pricing-hero.webp"
            alt="about-us"
            fill
            className="w-full h-full object-cover opacity-40 rounded-xl"
          />
          <div className="flex flex-col xl:flex-row justify-between z-10 gap-[50px]">
            <div className="flex flex-col justify-center gap-[16px]">
              <p className="text-primary text-[16px]">
                SHOWCASE YOUR BRANDED RESIDENCE
              </p>
              <h1 className="text-[30px] lg:text-[36px]">
                Select Your Plan and Start Reaching Affluent Buyers Now
              </h1>
              <p className="text-[18px] text-white/60">
                From basic listings to premium exposure, we offer flexible plans
                to help you showcase your properties, generate qualified leads,
                and close more deals faster.
              </p>
            </div>
            <div className="w-full lg:min-w-[550px]">
              <ClientCommonInfoForm />
            </div>
          </div>
        </div>
      </div>

      {/* SECOND SECTION */}
      <div className="bg-white">
        <SectionLayout>
          <div className="flex flex-col gap-4 rounded-xl p-4 xl:mx-16">
            <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full">
              CHOOSE YOUR PLAN
            </span>
            <h2 className="text-4xl text-black font-bold w-[100%] lg:w-[70%] text-left lg:text-center mx-auto">
              Find the right plan you want
            </h2>
            <p className="text-md text-[#4D4D4DCC] lg:text-lg w-full lg:w-[70%] text-left lg:text-center mx-auto">
              We connect developers with a global audience of high-end buyers,
              providing premium marketing solutions that maximize exposure and
              drive sales.
            </p>
          </div>

          <div className="flex gap-[24px] flex-col xl:flex-row">
            {/* STARTER PLAN */}
            <div className="flex flex-1 flex-col bg-white border-1 border-[#D4D4D4] rounded-xl p-[32px] gap-[10px]">
              <h1 className="text-[#171D22] !font-medium text-[36px]">Free</h1>
              <h2 className="text-[#171D22] text-[20px]">Starter plan</h2>
              <p className="text-[#171D22CC] text-[16px]">
                Perfect for developers with limited budgets who want to gain
                initial exposure and test the platform before upgrading.
              </p>
              <Link
                href="/#"
                className="w-full my-4  z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-[#F5F5F4] text-black hover:bg-white/90 h-9 px-[40px] py-[20px] has-[>svg]:px-3"
              >
                Get started for free
              </Link>
              <p className="!font-semibold text-[20px] text-[#171D22]">
                Features
              </p>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check.svg"
                  alt="check"
                  width={24}
                  height={24}
                />
                <p className="text-[#171D22CC]">
                  Basic property listing with limited features.
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check.svg"
                  alt="check"
                  width={24}
                  height={24}
                />
                <p className="text-[#171D22CC]">
                  Strategic partnership to ensure you get the most
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check.svg"
                  alt="check"
                  width={24}
                  height={24}
                />
                <p className="text-[#171D22CC]">Brief property overview.</p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check.svg"
                  alt="check"
                  width={24}
                  height={24}
                />
                <p className="text-[#171D22CC]">
                  Essential contact information.
                </p>
              </div>
            </div>

            {/* PREMIUM PLAN */}
            <div className="flex flex-1 flex-col bg-beigeVariant10 rounded-xl p-[32px] gap-[10px]">
              <div className="flex flex-col lg:flex-row justify-between gap-2">
                <h1 className="text-[#171D22] !font-medium text-[36px]">
                  Premium
                </h1>
                <Image
                  src="/icons/most-popular.svg"
                  alt="badge"
                  width={150}
                  height={40}
                  objectFit="responsive"
                />
              </div>
              <h2 className="text-[#171D22] text-[20px]">1,500$/month</h2>
              <p className="text-[#171D22CC] text-[16px]">
                Ideal for developers ready to invest in premium marketing
                strategies to actively generate leads, increase visibility, and
                manage a growing portfolio.
              </p>
              <Link
                href="/#"
                className="w-full my-4  z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-white hover:bg-primary/90 h-9 px-[40px] py-[20px] has-[>svg]:px-3"
              >
                Get started
              </Link>
              <p className="!font-semibold text-[20px] text-[#171D22]">
                Features
              </p>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check-primary.svg"
                  alt="check"
                  width={16}
                  height={16}
                />
                <p className="text-[#171D22CC] text-[14px]">
                  Includes all Basic Plan features
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check-primary.svg"
                  alt="check"
                  width={16}
                  height={16}
                />
                <p className="text-[#171D22CC] text-[14px]">
                  Showcase your brand with enhanced property listings
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check-primary.svg"
                  alt="check"
                  width={16}
                  height={16}
                />
                <p className="text-[#171D22CC] text-[14px]">
                  Access leads from buyers who inquire through our platform
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check-primary.svg"
                  alt="check"
                  width={16}
                  height={16}
                />
                <p className="text-[#171D22CC] text-[14px]">
                  Boost traffic with advanced SEO and performance analytics
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check-primary.svg"
                  alt="check"
                  width={16}
                  height={16}
                />
                <p className="text-[#171D22CC] text-[14px]">
                  Easily upload inventory for visitors to view and inquire about
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check-primary.svg"
                  alt="check"
                  width={16}
                  height={16}
                />
                <p className="text-[#171D22CC] text-[14px]">
                  Highlight units with exclusive BBR offers for our visitors
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check-primary.svg"
                  alt="check"
                  width={16}
                  height={16}
                />
                <p className="text-[#171D22CC] text-[14px]">
                  Get AI-driven insights to improve performance and lead
                  generation
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check-primary.svg"
                  alt="check"
                  width={16}
                  height={16}
                />
                <p className="text-[#171D22CC] text-[14px]">
                  Receive expert support from a dedicated marketing consultant
                </p>
              </div>
            </div>

            {/* CUSTOM PLAN */}
            <div className="flex flex-1 flex-col bg-white border-1 border-[#D4D4D4] rounded-xl p-[32px] gap-[10px]">
              <h1 className="text-[#171D22] !font-medium text-[36px]">
                Bespoke
              </h1>
              <h2 className="text-[#171D22] text-[20px]">Custom plan</h2>
              <p className="text-[#171D22CC] text-[16px]">
                Great for developers seeking comprehensive, results-driven
                support with maximum premium exposure, strategic guidance, and a
                flexible fee structure tied to performance.
              </p>
              <Link
                href="/#"
                className="w-full my-4 z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-[#F5F5F4] text-black hover:bg-white/90 h-9 px-[40px] py-[20px] has-[>svg]:px-3"
              >
                Schedule a call
              </Link>
              <p className="!font-semibold text-[20px] text-[#171D22]">
                Features
              </p>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check.svg"
                  alt="check"
                  width={24}
                  height={24}
                />
                <p className="text-[#171D22CC]">
                  All Premium Plan features included for enhanced property
                  exposure and lead generation
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check.svg"
                  alt="check"
                  width={24}
                  height={24}
                />
                <p className="text-[#171D22CC]">
                  Strategic partnership to ensure you get the most out of the
                  platform
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check.svg"
                  alt="check"
                  width={24}
                  height={24}
                />
                <p className="text-[#171D22CC]">
                  Tailored strategy for achieving top rankings in relevant
                  categories, including location, lifestyle, and property type
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/icons/circle-check.svg"
                  alt="check"
                  width={24}
                  height={24}
                />
                <p className="text-[#171D22CC]">
                  Flexible performance-based pricing options with shared success
                  incentives to align our goals
                </p>
              </div>
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* THIRD SECTION */}
      <div className="bg-[#FCF9F6]">
        <SectionLayout>
          <div className="flex flex-col gap-4 rounded-xl p-4 xl:mx-16">
            <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full">
              PLAN 0VERVIEW
            </span>
            <h2 className="text-4xl text-black font-bold w-[100%] lg:w-[70%] text-left lg:text-center mx-auto">
              Plan Overview
            </h2>
            <p className="text-md text-[#4D4D4DCC] lg:text-lg w-full lg:w-[70%] text-left lg:text-center mx-auto">
              We connect developers with a global audience of high-end buyers,
              providing premium marketing solutions that maximize exposure and
              drive sales.
            </p>
          </div>
          <PlanOverview />
        </SectionLayout>
      </div>

      {/* FOURTH SECTION */}
      <div className="bg-beigeVariant4">
        <SectionLayout>
          <div className="flex flex-col lg:flex-row">
            <div>
              <h1 className="text-[#171D22] text-[36px]">
                Increase your rankings
              </h1>
              <p className="text-[#4D4D4DCC] text-[20px]">
                Enhance your property’s reputation with strategic rankings,
                giving your development the credibility needed to convert more
                leads into buyers.
              </p>
            </div>
            <Link
              href="/#"
              className="w-full lg:w-fit place-self-end my-4  z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-white hover:bg-primary/90 h-9 px-[40px] py-[20px] has-[>svg]:px-3"
            >
              Get started
            </Link>
          </div>
          <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[60px] items-center">
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col lg:flex-row gap-[16px]">
                <div className="flex-1 bg-white p-[24px] rounded-xl">
                  <h2 className="text-black">By City</h2>
                  <p className="text-black/50 text-[14px]">
                    Get ranked in the top properties for your city to attract
                    local high-net-worth buyers.
                  </p>
                </div>
                <div className="flex-1 bg-white p-[24px] rounded-xl">
                  <h2 className="text-black">By Geographical area</h2>
                  <p className="text-black/50 text-[14px]">
                    Highlight your property in the top rankings for categories
                    like condos, penthouses, or villas.
                  </p>
                </div>
                <div className="flex-1 bg-white p-[24px] rounded-xl">
                  <h2 className="text-black">By Country</h2>
                  <p className="text-black/50 text-[14px]">
                    Secure a spot in the top branded residences in your country,
                    increasing your appeal to both lo.
                  </p>
                </div>
              </div>
              <div>
                <div className="flex flex-col lg:flex-row gap-[16px]">
                  <div className="flex-1 bg-white p-[24px] rounded-xl">
                    <h2 className="text-black">By Lifestyle</h2>
                    <p className="text-black/50 text-[14px]">
                      Rank your property in lifestyle categorie.g., beachfront,
                      urban, eco-friendly) to reach buyers ank your property in
                      lifestyle categorie.g., beachfront, urban, eco-friendly)
                      to reach buyers
                    </p>
                  </div>
                  <div className="flex-1 bg-white p-[24px] rounded-xl">
                    <h2 className="text-black">By Brand</h2>
                    <p className="text-black/50 text-[14px]">
                      Rank your property in lifestyle categorie.g., beachfront,
                      urban, eco-friendly) to reach buyers ank your property in
                      lifestyle categorie.g., beachfront, urban, eco-friendly)
                      to reach buyers
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Image
              src="/pricing-residence.webp"
              alt="residence"
              width={450}
              height={550}
            />
          </div>
        </SectionLayout>
      </div>

      {/* FIFTH SECTION */}
      <div className="bg-beigeVariant11">
        <SectionLayout>
          <div className="flex flex-col gap-4 rounded-xl p-4 xl:mx-16">
            <h2 className="text-4xl text-black font-bold w-[100%] lg:w-[70%] text-left lg:text-center mx-auto">
              Property Verification
            </h2>
            <p className="text-md text-[#4D4D4DCC] lg:text-lg w-full lg:w-[70%] text-left lg:text-center mx-auto">
              Gain higher visibility through our platform’s ranking system,
              positioning your property at the top of searches and attracting
              more attention from potential buyers.
            </p>
            <Image
              src="/property-verification.webp"
              alt="Property verification"
              width={1600}
              height={400}
              className="mt-6"
            />
          </div>
        </SectionLayout>
      </div>

      {/* SIXTH SECTION */}
      <div className="bg-white">
        <SectionLayout>
          <div className="flex flex-col lg:flex-row gap-[40px]">
            <Image
              src="/property-placement.webp"
              alt="Property placement"
              width={500}
              height={500}
              className="flex-1 w-full"
            />
            <div className="flex flex-col flex-1 gap-4">
              <h1 className="text-[#101518] text-[36px]">
                Featured Property Placements
              </h1>
              <p className="text-[#171D22]">
                Gahigher visibility through our platform’s ranking system,
                positioning your property at the top of searches and attracting
                more attention from potential buyers.
              </p>
              <div className="flex gap-2 items-start p-2">
                <Image
                  src="/icons/crown.svg"
                  alt="crown"
                  height={36}
                  width={36}
                />
                <div>
                  <h2 className="text-[#171D22] text-[24px]">
                    Top Search Ranking
                  </h2>
                  <p className="text-[#4D4D4DCC] text-[14px]">
                    Position your listing at the top of search results to
                    attract more buyers
                  </p>
                </div>
              </div>
              <hr className="border-t border-primary my-2 hidden lg:inline" />
              <div className="flex gap-2 items-start p-2">
                <Image
                  src="/icons/house-line.svg"
                  alt="crown"
                  height={36}
                  width={36}
                />
                <div>
                  <h2 className="text-[#171D22] text-[24px]">
                    Homepage Feature
                  </h2>
                  <p className="text-[#4D4D4DCC] text-[14px]">
                    Display your property on our homepage, seen by thousands of
                    active,
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* SEVENTH SECTION */}
      <FaqBlock themeLight />
    </div>
  );
};

export default PricingPage;

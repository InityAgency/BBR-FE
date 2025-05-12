import BrandSlider from "@/components/web/Brands/BrandSlider";
import ClientCommonInfoForm from "@/components/web/Forms/ClientCommonInfoForm";
import SectionLayout from "@/components/web/SectionLayout";
import Image from "next/image";
import Link from "next/link";

const HowItWorksPage = () => {
  return (
    <div>
      {/* FIRST SECTION */}
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 xl:px-12 py-12 gap-4 xl:gap-12 mb-8 xl:mb-10">
        <div className="flex flex-col gap-6 w-full bg-secondary bg-black/50 p-4 xl:p-8 py-12 xl:py-[50px] relative overflow">
          <Image
            src="/how-it-works-hero.webp"
            alt="about-us"
            fill
            className="w-full h-full object-cover opacity-40 rounded-xl"
          />
          <div className="flex flex-col xl:flex-row justify-between z-10 gap-[50px]">
            <div className="flex flex-col justify-center gap-[16px]">
              <p className="text-primary text-[16px]">STEP-BY-STEP PROCESS</p>
              <h1 className="text-[30px] xl:text-[36px]">
                Easily Showcase and Sell Your Branded Residences
              </h1>
              <p className="text-[18px] text-white/60">
                Follow our simple process to list your luxury properties,
                attract affluent buyers, and close deals fasterall while
                maximizing your exposure with targeted marketing and
                verification services.
              </p>
            </div>
            <div className="w-full xl:min-w-[550px]">
              <ClientCommonInfoForm />
            </div>
          </div>
        </div>
      </div>

      {/* SECOND SECTION */}
      <div className="bg-[#FCF9F6]">
        <SectionLayout>
          <div className="flex flex-col xl:w-[65%] place-self-center">
            <p className="text-primary text-center tracking-widest text-[14px] xl:text-[16px]">
              HOW IT WORKS
            </p>
            <h1 className="text-black text-center text-[30px] xl:text-[40px] mb-10">
              A Simple Process to Showcase Your Branded Residences and Close
              Deals Faster
            </h1>
          </div>
          <div className="flex flex-col gap-2">
            {/* STEP 1 */}
            <div className="relative w-full grid grid-cols-1 xl:grid-cols-2 relative">
              <div className="flex flex-col gap-4 text-black pb-10 xl:border-b-1 xl:border-primary mx-10">
                <h1 className="text-[30px]">
                  Create Your Developer Account and Choose a Plan
                </h1>
                <p className="font-light">
                  Getting started is easy. Simply sign up for a free developer
                  account and select the plan that best fits your needs.
                </p>
                <ul className="flex flex-col font-light gap-4 list-disc px-6">
                  <li className="text-black text-[16px]">
                    Basic Plan (Free): Start with essential features, perfect
                    for smaller developers or individual properties.
                  </li>
                  <li className="text-black text-[16px]">
                    Premium Plan: Unlock advanced tools and marketing support
                    for greater exposure.
                  </li>
                  <li className="text-black text-[16px]">
                    Bespoke Plan (Custom): A fully tailored solution for large
                    developers, offering personalized marketing and custom
                    features.
                  </li>
                  <li className="text-black text-[16px]">
                    Sign-Up Form: Complete the registration form with your name,
                    email, and company details.
                  </li>
                  <li className="text-black text-[16px]">
                    Profile Setup: Verify your email and set up your developer
                    profile by filling in essential information about your
                    company and properties.
                  </li>
                </ul>
                <Link
                  href="/#"
                  className="z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all text-primary border-1 border-primary hover:bg-white/90 h-9 px-[40px] py-[20px] has-[>svg]:px-3 w-full xl:w-fit"
                >
                  Sign Up Now
                </Link>
              </div>
              <div className="flex relative text-black justify-center items-center border-b-1 border-primary xl:mb-0 xl:pb-0 mb-10 pb-10 mx-10">
                <div className="w-full px-10 flex gap-4 items-center">
                  <hr className="hidden xl:block flex-1 border-t-2 mr-6 border-primary min-w-[150px]" />
                  <Image
                    src="/how-img-step-1.webp"
                    alt="how-img-1"
                    width={350}
                    height={350}
                    className="flex-1"
                  />
                </div>
              </div>
              <div
                className="absolute hidden xl:block top-0 bottom-0 left-1/2 w-[1px]"
                style={{
                  borderLeft: "3px dashed",
                  borderImage:
                    "repeating-linear-gradient(to bottom, #B3804C 0, #B3804C 10px, transparent 10px, transparent 20px) 1",
                }}
              />
              <Image
                src="/icons/how-step-1.svg"
                alt="step-1"
                width={60}
                height={60}
                className="hidden xl:block absolute top-1/2 bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              />
            </div>
            {/* STEP 2 */}
            <div className="relative w-full grid grid-cols-1 xl:grid-cols-2 relative">
              <div className="flex relative text-black justify-center items-center xl:border-b-1 xl:border-primary mx-10">
                <div className="w-full px-10 flex gap-4 items-center">
                  <Image
                    src="/how-img-step-2.webp"
                    alt="how-img-1"
                    width={350}
                    height={350}
                    className="flex-1"
                  />
                  <hr className="hidden xl:block flex-1 border-t-2 mr-6 border-primary" />
                </div>
              </div>
              <div className="flex flex-col gap-4 text-black pb-10 pt-10 border-b-1 border-primary mx-10">
                <h1 className="text-[30px]">
                  List and Verify Your Branded Residences
                </h1>
                <p className="font-light">
                  Once your profile is set up, it's time to showcase and verify
                  your properties for enhanced credibility.
                </p>
                <ul className="flex flex-col font-light gap-4 list-disc px-6">
                  <li className="text-black text-[16px]">
                    Property Upload: Add your branded residences to the platform
                    by providing key property details such as descriptions,
                    location, and price.
                  </li>
                  <li className="text-black text-[16px]">
                    Media Uploads: Upload high-quality images, virtual tours,
                    and videos to make your listings stand out.
                  </li>
                  <li className="text-black text-[16px]">
                    Virtual Verification: Submit media and documentation to
                    verify your property online.
                  </li>
                  <li className="text-black text-[16px]">
                    Onsite Verification: Request a physical assessment by our
                    team to further validate your property.
                  </li>
                  <li className="text-black text-[16px]">
                    Verified Badge: Gain a trusted verified badge to enhance
                    credibility and buyer trust.
                  </li>
                </ul>
                <Link
                  href="/#"
                  className="z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all text-primary border-1 border-primary hover:bg-white/90 h-9 px-[40px] py-[20px] has-[>svg]:px-3 w-full xl:w-fit"
                >
                  Start Listing and Verifying
                </Link>
              </div>

              <div
                className="hidden xl:block absolute top-0 bottom-0 left-1/2 w-[1px]"
                style={{
                  borderLeft: "3px dashed",
                  borderImage:
                    "repeating-linear-gradient(to bottom, #B3804C 0, #B3804C 10px, transparent 10px, transparent 20px) 1",
                }}
              />
              <Image
                src="/icons/how-step-2.svg"
                alt="step-1"
                width={60}
                height={60}
                className="hidden xl:block absolute top-1/2 bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              />
            </div>
            {/* STEP 3 */}
            <div className="relative w-full grid grid-cols-1 xl:grid-cols-2 relative">
              <div className="flex flex-col gap-4 text-black pb-10 pt-10 xl:border-b-1 xl:border-primary mx-10">
                <h1 className="text-[30px]">
                  Optimize for Maximum Exposure and Rankings
                </h1>
                <p className="font-light">
                  Targeted Marketing Tools: Use advanced targeting to ensure
                  your listings reach the right buyers based on location,
                  lifestyle, and preferences.
                </p>
                <p className="text-[18px] !font-semibold">
                  Submit for Rankings:{" "}
                </p>
                <ul className="flex flex-col font-light gap-4 list-disc px-6">
                  <li className="text-black text-[16px]">
                    Rank by Lifestyle: Submit your branded residences for
                    rankings based on lifestyle categories like beachfront,
                    urban, or resort living.
                  </li>
                  <li className="text-black text-[16px]">
                    Rank by Location: Get your property ranked at the global,
                    country, or city level, helping it stand out in the right
                    markets.
                  </li>
                  <li className="text-black text-[16px]">
                    Rank by Location: Get your property ranked at the global,
                    country, or city level, helping it stand out in the right
                    markets.
                  </li>
                </ul>
                <p className="font-light">
                  SEO Optimization: Our platform automatically optimizes your
                  listings for search engines, ensuring maximum visibility.
                </p>
                <p className="font-light">
                  Featured Properties: Highlight your properties in featured
                  sections to gain more attention from high-net-worth buyers.
                </p>
                <Link
                  href="/#"
                  className="z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all text-primary border-1 border-primary hover:bg-white/90 h-9 px-[40px] py-[20px] has-[>svg]:px-3 w-full xl:w-fit"
                >
                  Optimize, Rank, and Feature Your Listings
                </Link>
              </div>
              <div className="flex relative text-black justify-center items-center mb-10 pb-10 xl:mb-0 xl:pb-0 border-b-1 border-primary mx-10">
                <div className="w-full px-10 flex gap-4 items-center">
                  <hr className="flex-1 border-t-2 mr-6 border-primary" />
                  <Image
                    src="/how-img-step-3.webp"
                    alt="how-img-1"
                    width={350}
                    height={350}
                    className="flex-1 ml-[-40px] xl:ml-0"
                  />
                </div>
              </div>
              <div
                className="hidden xl:block absolute top-0 bottom-0 left-1/2 w-[1px]"
                style={{
                  borderLeft: "3px dashed",
                  borderImage:
                    "repeating-linear-gradient(to bottom, #B3804C 0, #B3804C 10px, transparent 10px, transparent 20px) 1",
                }}
              />
              <Image
                src="/icons/how-step-3.svg"
                alt="step-1"
                width={60}
                height={60}
                className="hidden xl:block absolute top-1/2 bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              />
            </div>
            {/* STEP 4 */}
            <div className="relative w-full grid grid-cols-1 xl:grid-cols-2 relative">
              <div className="flex relative text-black justify-center items-center mx-10">
                <div className="w-full px-10 flex gap-4 items-center">
                  <Image
                    src="/how-img-step-4.webp"
                    alt="how-img-1"
                    width={350}
                    height={350}
                    className="flex-1"
                  />
                  <hr className="flex-1 border-t-2 mr-6 border-primary" />
                </div>
              </div>
              <div className="flex flex-col gap-4 text-black pb-10 pt-10 mx-10">
                <h1 className="text-[30px]">
                  Close Deals and Analyze Your Success
                </h1>
                <p className="font-light">
                  Turn inquiries into sales with serious buyers and track your
                  progress with advanced analytics.
                </p>
                <ul className="flex flex-col font-light gap-4 list-disc px-6">
                  <li className="text-black text-[16px]">
                    Lead Generation: Receive inquiries directly from
                    high-net-worth buyers actively seeking branded residences. 
                  </li>
                  <li className="text-black text-[16px]">
                    Lead Management Tools: Track and manage leads efficiently
                    with our integrated lead management system. 
                  </li>
                  <li className="text-black text-[16px]">
                    Closing Deals: Use our negotiation tools to finalize deals
                    with confidence. 
                  </li>
                  <li className="text-black text-[16px]">
                    Performance Metrics: View real-time data such as property
                    views, inquiries, and lead conversion rates. 
                  </li>
                  <li className="text-black text-[16px]">
                    Analytics Dashboard: Monitor the performance of your
                    listings and optimize them for better results. 
                  </li>
                </ul>
                <p className="font-bold text-[16px]">
                  Revenue Streams: Generate revenue through:
                </p>
                <ul className="flex flex-col font-light gap-4 list-disc px-6">
                  <li className="text-black text-[16px]">
                    Listing Fees: Earn from featured and premium listings.
                  </li>
                  <li className="text-black text-[16px]">
                    Transaction Commissions: Benefit from commissions on closed
                    deals. 
                  </li>
                  <li className="text-black text-[16px]">
                    Verification Services: Add value through virtual and onsite
                    verification services. 
                  </li>
                </ul>
                <Link
                  href="/#"
                  className="z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all text-primary border-1 border-primary hover:bg-white/90 h-9 px-[40px] py-[20px] has-[>svg]:px-3 w-full xl:w-fit"
                >
                  See How Others Have Closed Deals
                </Link>
              </div>

              <div
                className="hidden xl:block absolute top-0 bottom-0 left-1/2 w-[1px]"
                style={{
                  borderLeft: "3px dashed",
                  borderImage:
                    "repeating-linear-gradient(to bottom, #B3804C 0, #B3804C 10px, transparent 10px, transparent 20px) 1",
                }}
              />
              <Image
                src="/icons/how-step-4.svg"
                alt="step-1"
                width={60}
                height={60}
                className="hidden xl:block absolute top-1/2 bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              />
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* THIRD SECTION */}
      <SectionLayout>
        <BrandSlider />
      </SectionLayout>
    </div>
  );
};

export default HowItWorksPage;

import BrandSlider from "@/components/web/Brands/BrandSlider";
import SectionLayout from "@/components/web/SectionLayout";
import Image from "next/image";
import Link from "next/link";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'About Us: Experts in Luxury Real Estate',
    description: 'Discover the story behind Best Branded Residences. Our team of luxury real estate experts combines data-driven insights and industry experience to curate, evaluate, and recommend the world’s most prestigious branded residences. Learn more about our mission, values, and commitment to excellence in the luxury property market.',
    slug: 'about-us',
    keywords: ['about us', 'luxury residences', 'company info']
  }
})

const B2BAboutUsPage = () => {
  return (
    <div>
      {/* FIRST SECTION */}
      <div className="relative flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-8 lg:mb-10">
        <div className="flex flex-col gap-6 w-full bg-secondary bg-black/50 p-2 lg:p-8 py-2 lg:py-[50px] relative overflow xl:max-w-[1600px] mx-auto">
          <Image
            src="/b2b-about-us-hero.webp"
            alt="about-us"
            fill
            className="w-full h-full object-cover opacity-40 rounded-xl"
          />
          <div className="flex flex-col xl:flex-row justify-between z-10 gap-[50px]">
            <div className="flex flex-col justify-center gap-[16px] text-center p-[20px] lg:p-[150px]">
              <p className="text-primary text-[16px]">
                UNLOCK THE FULL POTENTIAL OF YOUR BRANDED RESIDENCES
              </p>
              <h1 className="text-[30px] lg:text-[36px]">
                Partner with Best Branded Residences to Elevate Your
                Development’s Global Presence and Drive Unmatched Results
              </h1>
              <p className="text-[18px] text-[#F1F1F1]">
                At Best Branded Residences (BBR), we believe in shaping the
                future of branded residences by empowering developers to achieve
                their full potential. In an increasingly competitive market,
                aligning with BBR is not just an option—it’s a strategic
                necessity for developers looking to succeed at the highest
                levels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND SECTION */}
      <div className="bg-beigeVariant11">
        <SectionLayout>
          <div className="flex flex-col gap-[20px] lg:flex-row lg:gap-[160px] xl:max-w-[1600px] mx-auto">
            <div>
              <p className="text-primary text-[14px] lg:text-[18px] tracking-widest">
                EXCLUSIVE CIRCLE 
              </p>
              <h1 className="text-black text-[30px] lg:text-[40px] ">
                Join an Exclusive Circle of Prestigious Developers  
              </h1>
              <p className="text-[#4D4D4D] text-[16px] lg:text-[18px]">
                BBR is a trusted partner for leading brands and developers
                worldwide, forming strategic alliances that drive long-term
                success in branded residences. Developers benefit from aligning
                with a brand known for setting industry standards of excellence.
              </p>
            </div>
            <Link
              href="/#"
              className="place-self-end inline-flex place-self-center items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-4 has-[>svg]:px-3 w-full md:w-fit"
            >
              Get Started
            </Link>
          </div>
          <div className="w-full xl:max-w-[1600px] mx-auto">
            <Image
              src="/b2b-about-us-developers.webp"
              alt="about-us"
              height={550}
              width={1500}
              className="w-full"
            />
          </div>
        </SectionLayout>
      </div>

      {/* THIRD SECTION */}
      <div className="bg-white">
        <SectionLayout>
          <div className="w-full xl:max-w-[1600px] mx-auto">
            <div className="flex flex-col place-self-start lg:w-[50%]">
              <p className="text-primary text-[14px] lg:text-[18px] tracking-widest">
                OUR VISION
              </p>
              <h1 className="text-black text-[30px] lg:text-[40px] ">
                Shaping the Future of Luxury Branded Residences
              </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-[32px]">
              <div className="flex flex-col gap-2 flex-1/2">
                <p className="text-[16px] lg:text-[20px] text-[#4D4D4DCC] text-justify">
                  The branded residences market is rapidly expanding, but with
                  expansion comes increased competition. BBR provides developers
                  with the tools, insights, and strategic partnerships necessary
                  to stand out in this crowded field. Our vision is simple: to
                  connect the world’s most luxurious branded residences with
                  affluent, purchase-ready buyers. We are committed to driving
                  success for our developer partners by maximizing exposure,
                  credibility, and lead quality, ensuring your developments
                  consistently meet their sales and growth targets.
                </p>
                <p className="text-[16px] lg:text-[20px] text-[#4D4D4DCC] text-justify">
                  BBR is built on decades of experience in luxury real estate and
                  marketing, with a global network that provides unparalleled
                  visibility for your properties. Our team of experts understands
                  the evolving demands of high-net-worth individuals (HNWIs), and
                  we ensure that your developments are positioned to meet and
                  exceed these expectations.
                </p>
              </div>
              <div className="flex flex-1/2">
              <Image
                src="/b2b-about-image-3.webp"
                alt="about-us"
                height={550}
                width={400}
                className="flex-1/2 w-full h-full rounded-xl"
              />
              </div>
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* FOURTH SECTION */}
      <div className="bg-[#F7EFE8]">
        <SectionLayout>
          <div className="flex flex-col gap-[16px] lg:w-[60%] w-full xl:max-w-[1600px] mx-auto">
            <p className="text-primary text-[16px] text-center">
              REVENUE MODEL
            </p>
            <h1 className="text-[30px] lg:text-[36px] text-black text-center">
              Driving Developer Success Through Strategic Partnerships
            </h1>
            <p className="text-[18px] text-[#4D4D4DCC] text-center">
              At BBR, we don’t just provide a platform; we partner with
              developers to deliver customized, data-driven solutions that lead
              to long-term success. Through strategic marketing, global
              outreach, and exclusive partnerships, we ensure that every project
              we work with reaches its maximum potential.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 w-full xl:max-w-[1600px] mx-auto">
            <div className="flex flex-1/2">
              <Image
                src="/b2b-about-img-4.webp"
                alt="img"
                width={640}
                height={440}
                className="w-full rounded-xl"
              />
            </div>
            <div className="flex flex-col flex-1/2 gap-[16px]">
              <div className="flex bg-white p-[22px] gap-[16px] rounded-xl">
                <Image
                  src="/icons/b2b-about-price.svg"
                  width={50}
                  height={50}
                  alt="home-icon"
                  className="place-self-start"
                />
                <div>
                  <h2 className="text-black text-[22px]">
                    Maximizing Premium Pricing and Sales Velocity
                  </h2>
                  <p className="text-black/80 text-[14px]">
                    BBR helps developers achieve premium pricing by leveraging
                    our global reach and expert marketing strategies. Branded
                    residences consistently outperform non-branded projects,
                    offering developers price premiums and accelerated
                    sales(Savills-Branded-Reside (spotlight---branded-res…).
                    Whether your development is in a competitive urban market or
                    a luxurious resort destination, our platform ensures your
                    project stands out to buyers willing to invest.
                  </p>
                </div>
              </div>

              <div className="flex bg-white p-[22px] gap-[16px] rounded-xl">
                <Image
                  src="/icons/b2b-about-medal.svg"
                  width={50}
                  height={50}
                  alt="home-icon"
                  className="place-self-start"
                />
                <div>
                  <h2 className="text-black text-[22px]">
                    Rankings That Boost Credibility and Trust
                  </h2>
                  <p className="text-black/80 text-[14px]">
                    Rankings matter. BBR’s strategic rankings are globally
                    recognized as a mark of excellence, enhancing your
                    property’s credibility and visibility. Our developers
                    benefit from being ranked in key categories—whether it’s
                    lifestyle rankings such as Best in Beach or Best in Golf, or
                    by geographic segmentation (e.g., best in city, country, or
                    worldwide)(spotlighbranded-res…)(jguide-to-branded-re…).
                    These rankings not only build trust but also help convert
                    leads faster
                  </p>
                </div>
              </div>

              <div className="flex bg-white p-[22px] gap-[16px] rounded-xl">
                <Image
                  src="/icons/b2b-about-idea.svg"
                  width={50}
                  height={50}
                  alt="home-icon"
                  className="place-self-start"
                />
                <div>
                  <h2 className="text-black text-[22px]">
                    Forward-Thinking Marketing Solutions
                  </h2>
                  <p className="text-black/80 text-[14px] ">
                    BBR's approach goes beyond traditional marketing. We offer
                    bespoke marketing strategies that include targeted SEO, PPC,
                    and AI-driven suggestions that optimize your listings for
                    maximum visibility and conversion. Our marketing solutions
                    are built on data, helping you continually refine your
                    approach and stay ahead of market
                    trends(jll-guide-to-branded-re…).lping you continually
                    refine your approach and stay ahead of market
                    trends(jll-guide-to-branded-re…).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* FIFTH SECTION */}
      <div className="bg-beigeVariant11">
        <SectionLayout>
          <div className="w-full xl:max-w-[1600px] mx-auto">     
            <div className="flex flex-col gap-[20px] lg:flex-row lg:gap-[160px] lg:w-[50%] place-self-start mb-8">
              <div>
                <p className="text-primary text-[14px] lg:text-[18px] tracking-widest">
                  OUR STORY
                </p>
                <h1 className="text-black text-[30px] lg:text-[40px] ">
                  Shape the Future of Branded Residences with Us
                </h1>
                <p className="text-[#4D4D4D] text-[16px] lg:text-[18px]">
                  Aligning with BBR is more than just a partnership—it’s a
                  commitment to being a leader in the branded residences space. We
                  invite developers who share our vision of excellence to join us
                  in shaping the future of luxury branded real estate.
                </p>
              </div>
            </div>
            <div className="flex gap-[24px] flex-col lg:flex-row">
              <div className="flex flex-col flex-1/2 gap-[12px] lg:gap-[18px] justify-between bg-[#F9E6D27A] rounded-xl p-[12px] lg:p-[16px]">
                <Image
                  src="/icons/gold-dots.svg"
                  alt="gold-dots"
                  width={30}
                  height={30}
                  className="w-[20px] h-[16px] lg:w-[30px] lg:h-[30px]"
                />
                <p className="text-[14px] lg:text-[20px] text-[#0F172A]">
                  We envision a platform where luxury, exclusivity, and quality
                  converge. With a background in building successful review
                  platforms, We recognize the need for a trusted resource in the
                  branded residences market. Our goal is simple: to create a space
                  where buyers can explore and discover the world’s most
                  prestigious properties, and where developers can showcase their
                  offerings to an elite audience.
                </p>
                <div className="flex gap-[12px] items-center">
                  <Image
                    src="/bbr-logo-circle.webp"
                    alt="bbr-logo"
                    width={40}
                    height={40}
                    className="w-[36px] h-[36px] lg:w-[52px] lg:h-[52px] rounded lg:rounded-xl"
                  />
                  <p className="text-[14px] lg:text-[16px] text-[#0F172A]">
                    BBR Founding Team
                  </p>
                </div>
              </div>
              <Image
                src="/b2b-about-img-4.webp"
                alt="img"
                width={600}
                height={450}
                className="flex-1/2 lg:max-w-[500px] lg:max-h-[400px] rounded-xl"
              />
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* SIXTH SECTION */}
      <section className="brand-slider px-4 lg:px-0 py-8 lg:py-0">
        <SectionLayout>
          <div className="flex flex-col items-center gap-4 xl:max-w-[1600px] mx-auto">
            <span className="text-md lg:text-lg lg:text-center text-primary w-full">
              PARTNERED WITH LEADING BRANDS
            </span>
            <h2 className="text-4xl font-bold w-[100%] lg:text-center mx-auto">
              We are trusted by leading brands
            </h2>
            <p className="text-[20px] text-[#D9D9D9] lg:w-[70%] lg:text-center">
              We partner with the industry’s top developers and brands to bring
              you exclusive, high-end projects that redefine luxury living.
            </p>
          </div>
          <div className="w-full xl:max-w-[1600px] mx-auto">
            <BrandSlider />
          </div>
        </SectionLayout>
      </section>
    </div>
  );
};

export default B2BAboutUsPage;

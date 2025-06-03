import { Button } from "@/components/ui/button";
import ClientCommonInfoForm from "@/components/web/Forms/ClientCommonInfoForm";
import RequestConsultationForm from "@/components/web/Forms/RequestConsultation";
import SectionLayout from "@/components/web/SectionLayout";
import Image from "next/image";
import Link from "next/link";

import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Investor Relations: Transparent Insights for the Valued Private Investors',
    description: 'Investor Relations: Partner with Best Brand Residences. Access financial reports, updates, and partnership opportunities in luxury branded residences.',
    slug: 'investor-relations',
    keywords: ['investor relations']
  }
})

const InvestorRelationsPage = () => {
  return (
    <div>
      {/* FIRST SECTION */}
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-8 lg:mb-10">
        <div className="flex flex-col gap-6 w-full bg-secondary bg-black/50 p-4 lg:p-8 py-12 lg:py-[50px] relative overflow xl:max-w-[1600px] mx-auto">
          <Image
            src="/investor-relations-hero.png"
            alt="about-us"
            fill
            className="w-full h-full object-cover opacity-40 rounded-xl"
          />
          <div className="flex flex-col xl:flex-row justify-between z-10 gap-[50px]">
            <div className="flex flex-col justify-center gap-[16px]">
              <p className="text-primary text-[16px]">INVESTOR RELATIONS</p>
              <h1 className="text-[30px] lg:text-[36px]">
                Transparent Insights for the Valued Private Investors
              </h1>
              <p className="text-[18px] text-white/60">
                Follow our simple process to list your luxury properties,
                attract affluent buyers, and close deals fasterall while
                maximizing your exposure with targeted marketing and
                verification services.
              </p>
            </div>
            <div className="w-full lg:min-w-[550px]">
              <ClientCommonInfoForm />
            </div>
          </div>
        </div>
      </div>

      {/* SECOND SECTION */}
      <div className="bg-white border-2 border-b-[#F1E8DF]">
        <SectionLayout>
          <div className="flex flex-col bg-beigeVariant11 gap-4 p-[16px] lg:p-[30px] rounded-xl w-full xl:max-w-[1600px] mx-auto">
            <p className="text-primary tracking-widest">CURRENT PERFORMANCE</p>
            <h1 className="text-[30px] lg:text-[36px] text-[#101518]">
              Capturing the Growth in Luxury Branded Residences
            </h1>
            <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[60px]">
              <ul className="flex flex-col gap-2 list-disc px-4">
                <li className="text-black text-[16px] text-justify">
                  <span className="font-semibold">
                    Unprecedented Growth in the Luxury Branded Residences Market
                    :{" "}
                  </span>
                  The luxury branded residences market is currently experiencing
                  remarkable growth. Industry experts project an annual increase
                  of 70% over the next five years. This surge is primarily
                  driven by rising demand for premium living spaces among
                  affluent buyers and investors.
                </li>
                <li className="text-black text-[16px] text-justify">
                  <span className="font-semibold">
                    Our Platform’s Competitive Advantage :{" "}
                  </span>
                  Our platform stands out due to its innovative approach and
                  extensive industry connections, placing us in a unique
                  position to capitalize on this momentum. These strengths allow
                  us to establish a solid foothold in the rapidly expanding
                  market.
                </li>
                <li className="text-black text-[16px] text-justify">
                  <span className="font-semibold">
                    Strategic Focus on Key Global Regions :{" "}
                  </span>
                  We are strategically concentrating on North America, Europe,
                  and Asia—regions where the appetite for luxury living is at
                  its highest. These markets are central to our expansion
                  strategy.
                </li>
                <li className="text-black text-[16px] text-justify">
                  <span className="font-semibold">
                    Leveraging Local Insights and Customizing Offerings :{" "}
                  </span>
                  In each region, we leverage in-depth local market insights to
                  tailor our offerings to the specific preferences and
                  expectations of high-end clients. This enables us to meet
                  demand with greater precision and relevance.
                </li>
                <li className="text-black text-[16px] text-justify">
                  <span className="font-semibold">
                    Our Goal: Sustainable Growth and Market Leadership :{" "}
                  </span>
                  Through this focused and adaptive approach, we aim to
                  strengthen our presence and drive sustained growth in the
                  luxury branded residences sector.
                </li>
              </ul>
              <Image
                src="/investor-current-performance.png"
                alt="img"
                width={550}
                height={400}
              />
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* THIRD SECTION */}
      <div className="bg-white">
        <SectionLayout>
          <div className="flex flex-col gap-[30px] lg:gap-[58px] w-full xl:max-w-[1600px] mx-auto">
            <div className="flex flex-col gap-[10px] lg:w-[65%] place-self-center">
              <p className="text-primary text-center tracking-widest text-[14px] xl:text-[16px]">
                OUR SOLUTION
              </p>
              <h1 className="text-black text-center text-[30px] lg:text-[40px]">
                Innovative Platform Designed for your Success
              </h1>
              <p className="text-[#4D4D4D] text-center text-[16px] lg:text-[18px]">
                Best Branded Residences platform, built using cutting-edge
                technology and advanced AI-driven tools, is designed to lead the
                market in luxury branded residences. With a Minimum Viable
                Product (MVP) near completion, we are poised to deliver
                unparalleled value to developers and buyers alike. The platform
                is engineered for scalability, ensuring we can meet the growing
                demands of the market while continuously enhancing the user
                experience.
              </p>
            </div>
            <div className="contact-form-wrapper w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[20px] lg:gap-[80px]">
              <Image
                src="/investor-relations-1.png"
                width={800}
                height={400}
                alt="Connect With Experts"
                className="w-full h-full rounded-xl"
              />
              <Image
                src="/investor-relations-2.png"
                width={800}
                height={400}
                alt="Connect With Experts"
                className="w-full h-full rounded-xl"
              />
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* FOURTH SECTION */}
      <div className="bg-beigeVariant11">
        <SectionLayout>
          <div className="relative contact-form-wrapper w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[20px] lg:gap-[80px] xl:max-w-[1600px] mx-auto">
            <Image
              src="/texture.webp"
              alt="about-us"
              fill
              className="w-full h-full object-cover opacity-80"
            />
            <Image
              src="/investor-relations-3.png"
              width={800}
              height={400}
              alt="Connect With Experts"
              className="w-full h-full z-10"
            />
            <div className="z-1">
              <p className="text-primary tracking-widest">OUR GOAL</p>
              <h1 className="text-[#171D22] text-[36px] lg:text-[40px]">
                Strong Industry Interest and Early Partnerships
              </h1>
              <hr className="border-t border-[#B3804C3D] my-4" />
              <Image
                src="/icons/investor-globus.svg"
                width={50}
                height={50}
                alt="home-icon"
                className="place-self-start"
              />
              <h2 className="text-[#171D22] text-[24px] lg:text-[30px] mt-2">
                Global Luxury Momentum
              </h2>
              <p className="text-[#171D22CC]">
                We have garnered significant interest from leading developers
                and luxury brands worldwide. <br /> Advanced discussions with
                key industry players reflect the strong potential and
                credibility of our platform. This interest underscores our
                ability to deliver a platform that meets the evolving needs of
                the luxury real estate market.
              </p>
              <Link
                href="/contact"
                className="my-4 inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90 h-9 px-[40px] py-[20px] has-[>svg]:px-3"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* FIFTH SECTION */}
      <div className="bg-[#F7EFE8]">
        <SectionLayout>
          <div className="flex flex-col gap-[16px] w-full xl:max-w-[1600px] mx-auto">
            <p className="text-primary text-[16px]">REVENUE MODEL</p>
            <h1 className="text-[30px] lg:text-[36px] text-black">
              Diverse Revenue Streams for Sustainable Growth
            </h1>
            <p className="text-[18px] text-[#4D4D4DCC]">
              Our revenue model includes multiple streams for immediate profit
              and long-term growth. Diversifying income helps us withstand
              market changes and invest in new opportunities. This approach
              ensures financial stability while pursuing innovative projects for
              future success.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row flex-1/2 gap-[16px] w-full xl:max-w-[1600px] mx-auto">
            <div className="flex flex-1 bg-[#FCFCFCCC] p-[22px] gap-[16px] rounded-xl">
              <Image
                src="/icons/investor-user.svg"
                width={50}
                height={50}
                alt="home-icon"
                className="place-self-start"
              />
              <div>
                <h2 className="text-black text-[22px]">Advanced Profiles</h2>
                <p className="text-black/80 text-[14px]">
                  Premium listings provide enhanced visibility and increased
                  engagement among potential users. These listings stand out
                  more prominently, attracting more attention and interaction,
                  thereby offering developers a significant advantage in
                  promoting their applications effectively.
                </p>
              </div>
            </div>

            <div className="flex flex-1 bg-[#FCFCFCCC] p-[22px] gap-[16px] rounded-xl">
              <Image
                src="/icons/investor-trophy.svg"
                width={50}
                height={50}
                alt="home-icon"
                className="place-self-start"
              />
              <div>
                <h2 className="text-black text-[22px]">Ranking Fees</h2>
                <p className="text-black/80 text-[14px]">
                  Developer fees will be evaluated and ranked based on technical
                  skills, project experience, and previous work quality. This
                  ranking system will provide a clear assessment of each
                  developer’s strengths and areas for improvement, ensuring fair
                  comparison.eveloper’s strengths and
                </p>
              </div>
            </div>

            <div className="flex flex-1 bg-[#FCFCFCCC] p-[22px] gap-[16px] rounded-xl">
              <Image
                src="/icons/investor-speedometer.svg"
                width={50}
                height={50}
                alt="home-icon"
                className="place-self-start"
              />
              <div>
                <h2 className="text-black text-[22px]">
                  Performance-Driven Commissions
                </h2>
                <p className="text-black/80 text-[14px] ">
                  Developers gain from better rankings influenced by their sales
                  on our platform. This system incentivizes sales efforts and
                  ensures recognition and rewards. Our improved ranking system
                  motivates developers to aim for higher sales, fostering a
                  compDevelopers gain from better rankings influencedngs
                </p>
              </div>
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* SIXTH SECTION - WILL BE ADDED AFTER NEWSROOM PAGE */}

      {/* SEVENTH SECTION */}
      <div className="bg-secondary">
        <SectionLayout>
          <div className="flex gap-[80px]">
            <div className="contact-form-wrapper grid grid-cols-1 lg:grid-cols-2 gap-[80px] w-full xl:max-w-[1600px] mx-auto">
              <div className="flex flex-col gap-4">
                <p className="text-[16px] text-primary">GET IN TOUCH</p>
                <h1 className="text-[30px] lg:text-[40px]">
                  Connect with Our Experts
                </h1>
                <p className="text-[18px] text-justify">
                  Have questions or need personalized assistance? Our dedicated
                  consultants provide tailored guidance, ensuring you make the
                  right investment choices with confidence.
                </p>
                <p className="text-[18px] text-justify">
                  Whether you are looking for a luxury home, a profitable
                  investment, or an exclusive lifestyle experience, our
                  consultants are here to help.
                </p>
                <Link href="/schedule-a-demo" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit">
                  Schedule a consultation
                </Link>
                <Image
                  src="/connect-with-experts.png"
                  width={2800}
                  height={1600}
                  alt="Connect With Experts"
                  className="w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-4">
                <RequestConsultationForm />
              </div>
            </div>
          </div>
        </SectionLayout>
      </div>
    </div>
  );
};

export default InvestorRelationsPage;

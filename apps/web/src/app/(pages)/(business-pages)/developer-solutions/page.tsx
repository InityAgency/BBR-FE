import Image from "next/image";
import ClientCommonInfoForm from "@/components/web/Forms/ClientCommonInfoForm";
import SectionLayout from "@/components/web/SectionLayout";
import Link from "next/link";
import BrandSlider from "@/components/web/Brands/BrandSlider";
import ClientTestimonials from "@/components/web/ClientTestimonials/ClientTestimonials";
import HorizontalTabs from "@/components/web/HorizontalTabs/HorizontalTabs";

// #region Tabs
type TabContentProps = {
  content: {
    label1: string;
    title1: string;
    title2: string;
    title3: string;
    title4: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    list1: string[];
    list2: string[];
  };
};

const TabContent: React.FC<TabContentProps> = ({ content }) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-primary tracking-widest">{content.label1}</p>
      <h1 className="text-black text-[30px]">{content.title1}</h1>
      <h2 className="text-black text-[18px]">{content.title2}</h2>
      <p className="text-black text-[16px]">{content.paragraph1}</p>

      <ul className="flex flex-col gap-4 list-disc px-10">
        {content.list1.map((item, index) => (
          <li key={index} className="text-black text-[16px]">
            {item}
          </li>
        ))}
      </ul>

      <h2 className="text-black text-[18px]">{content.title3}</h2>
      <p className="text-black text-[16px]">{content.paragraph2}</p>

      <h2 className="text-black text-[18px]">{content.title4}</h2>
      <ul className="flex flex-col gap-4 list-disc px-10">
        {content.list2.map((item, index) => (
          <li key={index} className="text-black text-[16px]">
            {item}
          </li>
        ))}
      </ul>

      <p className="text-black text-[16px]">{content.paragraph3}</p>
    </div>
  );
};

const tabContent1 = {
  label1: "OUR SUGGESTION",
  title1: "How BBR Delivers High-Quality Purchase-Ready Leads",
  title2: "The Challenge of Reaching Affluent, Qualified Buyers",
  paragraph1:
    "Developers often struggle to connect with the right audience—affluent buyers who are actively searching for branded residences...",
  list1: [
    "Insufficient leads to sustain the sales pipeline.",
    "Low-quality leads, including buyers who lack budget or aren’t ready to purchase.",
    "Difficulty connecting with affluent individuals who are the right fit for luxury branded residences.",
  ],
  title3: "How BBR Solves This",
  paragraph2:
    "BBR delivers leads that are highly qualified and ready to make a purchase...",
  title4: "Why BBR Leads Stand Out",
  list2: [
    "Interested in your branded residence.",
    "Ready to purchase.",
    "Willing to pay premium prices.",
  ],
  paragraph3:
    "By leveraging BBR, developers can access a consistent flow of highly motivated leads...",
};

const tabContent2 = {
  label1: "BRAND PRESENCE & CREDIBILITY",
  title1: "How BBR Elevates Your Brand and Expands Global Reach",
  title2: "The Challenge of Standing Out in a Competitive Luxury Market",
  paragraph1:
    "Developers often struggle to build a strong brand presence and achieve visibility in the crowded luxury real estate market. Making your properties known to affluent buyers can be difficult when awareness and rankings are low.",
  list1: [
    "Weak brand presence in a highly competitive market.",
    "Limited awareness among your target audience.",
    "Difficulty ranking in relevant categories, such as city, lifestyle, or property type.",
  ],
  title3: "How BBR Solves This",
  paragraph2:
    "BBR boosts your brand visibility through premium rankings, global reach, and trust-building verification services. Your properties are placed in front of buyers who are ready to invest, making it easier for you to stand out in the market.",
  title4: "Why BBR's Visibility Tools Matter",
  list2: [
    "Rankings & Global Exposure: Gain top visibility in the categories that matter most to your audience. Being ranked on BBR's Best Branded Residences list instantly elevates your brand and provides global exposure, positioning you as a leader in luxury real estate while reaching affluent buyers worldwide.",
    "Strategic Partnerships & Paid Media: BBR collaborates with high-end luxury brands to create co-branded promotions that increase the perceived value of your property. We also invest in paid media, including targeted social media ads and sponsored content, to further extend the reach of your property.",
    "Influencer & Industry Collaborations: Partnering with influencers and key players in the luxury and real estate spaces, BBR helps showcase ranked properties to a broader, more affluent audience, amplifying your brand presence and credibility.",
  ],
  paragraph3:
    "By using BBR, your brand can gain global exposure and credibility, ensuring your properties reach the most discerning buyers.",
};

const tabContent3 = {
  label1: "SALES PROCESS & CONVERSIONS",
  title1: "How BBR Accelerates Sales and Increases Conversion Rates",
  title2: "The Challenge of Long Sales Cycles and High Buyer Expectations",
  paragraph1:
    "Branded residence developers often face extended sales cycles and difficulty converting leads into buyers. High buyer expectations tied to the brand, resistance to premium pricing, and the need for trust and credibility create barriers that delay the closing of deals.",
  list1: [
    "Sales cycles are extended due to high buyer expectations and complex decision-making processes.",
    "Buyers hesitate to pay premium prices without third-party validation.",
    "Trust and credibility are critical, but difficult to establish quickly.",
    "Poor follow-up and lead nurturing lead to lost opportunities and cold leads.",
  ],
  title3: "How BBR Solves This",
  paragraph2:
    "BBR shortens your sales cycle and boosts conversions by offering third-party validation through rankings, targeted marketing, and lead nurturing tools. Being ranked on BBR's Best Branded Residences list acts as a powerful endorsement, equivalent to a word-of-mouth referral, which has the highest conversion potential. This validation, combined with our CRM integration and real-time insights, ensures that developers can convert leads more efficiently and at higher price points.",
  title4: "Why BBR's Sales Tools Matter",
  list2: [
    "Rankings as Third-Party Validation: A high ranking on BBR's list provides the validation buyers need, comparable to a trusted referral. It reassures potential buyers that your property meets their high expectations, speeding up their decision-making process and increasing the likelihood of closing at a premium price.",
    "Lead Nurturing & CRM Integration: Our CRM tools help you manage and nurture leads, ensuring timely follow-ups that keep prospects engaged and reduce sales cycle delays. You can efficiently track buyer engagement and tailor your approach to convert leads faster.",
    "Real-Time Insights: With real-time data on lead activity, you can monitor buyer behavior, adjust your strategy in the moment, and engage buyers when they are most ready to make a decision. This leads to quicker closures and higher conversion rates.",
    "Targeted Exposure to Ready Buyers: BBR's platform connects you directly with affluent buyers who are actively seeking branded residences. These buyers are already deep into the decision-making process, allowing you to close deals faster with less friction.",
  ],
  paragraph3:
    "By leveraging BBR's third-party validation through rankings, advanced CRM tools, and real-time insights, branded residence developers can significantly reduce their sales cycles, close deals at higher rates, and convert more leads into buyers.",
};

const tabContent4 = {
  label1: "CREDIBILITY THROUGH STRATEGIC RANKINGS",
  title1: "How BBR Boosts Your Credibility Through Strategic Property Rankings",
  title2: "The Challenge of Building Credibility and Achieving High Rankings",
  paragraph1:
    "In a crowded luxury real estate market, being seen and trusted by buyers is crucial. Developers often struggle to stand out and gain credibility due to a lack of visibility in key categories, leaving buyers unsure of where to invest.",
  list1: [
    "Difficulty achieving high rankings in relevant categories .",
    "Struggling to gain visibility and credibility in a competitive market.",
    "Buyers are hesitant without third-party validation of the property's quality.",
  ],
  title3: "How BBR Solves This",
  paragraph2:
    "BBR's ranking system is designed to connect the right branded residences with buyers by categorizing properties based on key factors like lifestyle, property type, and location. Whether a developer's property is best in beach, best in golf, or best in new branded residences, being ranked on BBR provides a significant boost in credibility, helping buyers quickly identify top properties that match their preferences.",
  title4: "Why BBR's Rankings Matter",
  list2: [
    "Rankings in Key Categories: BBR ranks properties across multiple categories—lifestyle (e.g., beachfront living, golf living), property type (e.g., beachfront residences, urban luxury residences), and location (worldwide, by country, by city, or by continent). This ensures that your property is visible to the right buyers seeking specific experiences, property types, or geographic locations.",
    "Credibility Through Recognition: Being ranked as a top property in your category positions you as a leader in the luxury market, boosting your credibility and helping buyers make quicker, more confident decisions.",
    "Connecting Buyers to the Best Properties: Whether your property is known for its lifestyle appeal, its unique features, or its location, BBR's rankings help connect buyers with the right branded residences, making the buying process easier and more transparent.",
  ],
  paragraph3:
    "By securing a top spot in BBR's rankings, developers increase their property's visibility and trustworthiness, making it easier to attract serious buyers who are looking for the best in branded residences.",
};

const tabContent5 = {
  label1: "MARKETING STRATEGY & EXECUTION",
  title1:
    "How BBR Supports Developers with Comprehensive Marketing at Every Stage",
  title2:
    "The Challenge of Developing and Executing Effective Marketing Strategies",
  paragraph1:
    "Developers require marketing expertise tailored to the specific needs of their project, whether pre-construction, in-construction, or post-completion. Without targeted guidance, marketing strategies often fail to generate quality leads, establish an online presence, or reach the right audience effectively.",
  list1: [
    "Lack of marketing support at key stages of project development.",
    "Difficulty selecting the right marketing services and platforms.",
    "Struggling to build an online presence and effectively scale marketing efforts.",
  ],
  title3: "How BBR Solves This",
  paragraph2:
    "BBR offers comprehensive, hands-on marketing support for developers at every stage of their project, from pre-construction to completion. We help developers align with the right plan on BBR, select the most effective add-ons, or even create a bespoke plan with strategic partnerships. Our marketing services go beyond BBR's platform—we assist with developing your online presence, branding, and executing a full range of digital marketing strategies, utilizing our 25+ years of experience.",
  title4: "Why BBR's Marketing Support Stands Out",
  list2: [
    "Tailored Marketing for Every Stage: Whether your project is pre-construction, in-construction, or completed, BBR provides targeted marketing solutions for every phase, ensuring your property reaches the right audience.",
    "Strategic Plan Alignment & Add-Ons: We help you select the right BBR plan and services or create a bespoke strategy that includes strategic partnerships for maximum visibility and impact.",
    "Full-Service Marketing Beyond BBR: In addition to BBR's offerings, our experts can help you develop your online presence, optimize your branding, and implement SEO, PPC, content marketing, and reputation management to create a comprehensive, results-driven strategy.",
  ],
  paragraph3:
    "By partnering with BBR, developers gain access to a complete suite of marketing tools and expertise, both on and off the platform, ensuring the right audience is reached and results are maximized at every stage.",
};

const tabs = [
  {
    id: "tab1",
    label: "Lead Generation",
    content: <TabContent content={tabContent1} />,
  },
  {
    id: "tab2",
    label: "Branding",
    content: <TabContent content={tabContent2} />,
  },
  {
    id: "tab3",
    label: "Sales Processes and Conversions",
    content: <TabContent content={tabContent3} />,
  },
  {
    id: "tab4",
    label: "Ranking",
    content: <TabContent content={tabContent4} />,
  },
  {
    id: "tab5",
    label: "Marketing Strategy & Execution",
    content: <TabContent content={tabContent5} />,
  },
];
// #endregion

const MarketingSolutionsPage = () => {
  return (
    <div>
      {/* FIRST SECTION */}
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-8 lg:mb-10">
        <div className="flex flex-col gap-6 w-full bg-secondary bg-black/50 p-4 lg:p-8 py-12 lg:py-[50px] relative overflow">
          <Image
            src="/why-choose-us-from-outside.webp"
            alt="about-us"
            fill
            className="w-full h-full object-cover opacity-40 rounded-xl"
          />
          <div className="flex flex-col xl:flex-row justify-between z-10 gap-[50px]">
            <div className="flex flex-col justify-center gap-[16px]">
              <p className="text-primary text-[16px]">
                UNLOCK YOUR PROJECT’S FULL POTENTIAL
              </p>
              <h1 className="text-[30px] lg:text-[36px]">
                Transform Your Branded Residences with the Best Real Estate
                Network
              </h1>
              <p className="text-[18px] text-white/60">
                From showcasing your properties to affluent buyers to ensuring
                your property ranks among the best, BBR provides everything
                developers need to succeed. Connect with high-net-worth buyers,
                gain valuable insights, and generate leads with ease.
              </p>
            </div>
            <div className="w-full lg:min-w-[550px]">
              <ClientCommonInfoForm />
            </div>
          </div>
        </div>
      </div>

      {/* SECOND SECTION */}
      <div className="bg-beigeVariant8 py-4 xl:py-20">
        <div className="flex flex-col gap-4 rounded-xl p-4 xl:mx-16">
          <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full">
            OUR SOLUTIONS
          </span>
          <h2 className="text-4xl text-black font-bold w-[100%] lg:w-[50%] text-left lg:text-center mx-auto">
            How BBR Solves These Challenges
          </h2>
          <p className="text-md text-[#4D4D4DCC] lg:text-lg w-full lg:w-[50%] text-left lg:text-center mx-auto">
            BBR is designed to offer solutions for developers at every stage of
            their project’s life cycle from pre-construction to completion. We
            ensure that developers can
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 xl:mt-16 w-full">
            <div className="flex flex-col justify-center w-full bg-white rounded-2xl p-6 border">
              <div className="flex flex-col gap-4 mb-4">
                <div className="relative">
                  <Image
                    src="/icons/refresh-alt.svg"
                    alt="refresh"
                    width={60}
                    height={60}
                  />
                </div>
                <h3 className="text-2xl font-bold text-[#171D22]">
                  Generate high-quality leads
                </h3>
              </div>
              <p className="text-[#4D4D4DCC]">
                Throuisibility and credibility-building strategies, including
                premium rankings and global exposure.
              </p>
            </div>

            <div className="flex flex-col justify-center w-full bg-white rounded-2xl p-6 border">
              <div className="flex flex-col gap-4 mb-4">
                <div className="relative">
                  <Image
                    src="/icons/tag.svg"
                    alt="refresh"
                    width={60}
                    height={60}
                  />
                </div>
                <h3 className="text-2xl font-bold text-[#171D22]">
                  Shorten their sales cycles
                </h3>
              </div>
              <p className="text-[#4D4D4DCC]">
                By leveraging CRM tools, third-party validation, and buyer
                insights.
              </p>
            </div>

            <div className="flex flex-col justify-center w-full bg-white rounded-2xl p-6 border">
              <div className="flex flex-col gap-4 mb-4">
                <div className="relative">
                  <Image
                    src="/icons/medal.svg"
                    alt="refresh"
                    width={60}
                    height={60}
                  />
                </div>
                <h3 className="text-2xl font-bold text-[#171D22]">
                  Achieve high rankings
                </h3>
              </div>
              <p className="text-[#4D4D4DCC]">
                In the categories that matter most to their buyers, such as
                lifestyle, property type, and location.
              </p>
            </div>

            <div className="flex flex-col justify-center w-full bg-white rounded-2xl p-6 border">
              <div className="flex flex-col gap-4  mb-4">
                <div className="relative">
                  <Image
                    src="/icons/ruler.svg"
                    alt="refresh"
                    width={60}
                    height={60}
                  />
                </div>
                <h3 className="text-2xl font-bold text-[#171D22]">
                  Scale marketing efforts
                </h3>
              </div>
              <p className="text-[#4D4D4DCC]">
                Based on project size, whether small or large, with flexible
                plan options.
              </p>
            </div>

            <div className="flex flex-col justify-center w-full bg-white rounded-2xl p-6 border">
              <div className="flex flex-col gap-4 mb-4">
                <div className="relative">
                  <Image
                    src="/icons/square-dollar-chart.svg"
                    alt="refresh"
                    width={60}
                    height={60}
                  />
                </div>
                <h3 className="text-2xl font-bold text-[#171D22]">
                  Maximize ROI on marketing
                </h3>
              </div>
              <p className="text-[#4D4D4DCC]">
                With an all-in-one platform and access to advanced analytics.
              </p>
            </div>

            <div className="flex flex-col justify-center w-full bg-white rounded-2xl p-6 border">
              <div className="flex flex-col gap-4 mb-4">
                <div className="relative">
                  <Image
                    src="/icons/chart-mixed.svg"
                    alt="refresh"
                    width={60}
                    height={60}
                  />
                </div>
                <h3 className="text-2xl font-bold text-[#171D22]">
                  Make data-driven decisions
                </h3>
              </div>
              <p className="text-[#4D4D4DCC]">
                Through real-time insights and analytics to optimize marketing
                spend and lead engagement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* THIRD SECTION */}
      <div className="bg-beigeVariant4">
        <SectionLayout>
          <div className="relative flex flex-col gap-[16px] lg:gap-[20px] bg-beigeVariant6 rounded-xl px-[12px] py-[24px] lg:py-[66px] items-center">
            <Image
              src="/texture.webp"
              alt="about-us"
              fill
              className="w-full h-full object-cover opacity-40"
            />
            <h1 className="text-black text-[24px] lg:text-[40px] lg:w-[70%] text-center">
              Leverage performance-based marketing campaigns
            </h1>
            <p className="text-black text-[14px] lg:text-[18px] lg:w-[70%] text-center">
              Where developers pay based on the results generated, ensuring a
              cost-effective approach to lead generation and visibility. BBR
              also offers a fixed monthly fee + performance-based component for
              developers who want a hybrid model that includes predictable costs
              along with performance incentives
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

      {/* FOURTH SECTION */}
      <div className="bg-white">
        <SectionLayout>
          <div className="flex flex-col gap-[20px] lg:flex-row lg:gap-[160px]">
            <div>
              <p className="text-primary text-[14px] lg:text-[18px] tracking-widest">
                OUR SUGGESTION
              </p>
              <h1 className="text-black text-[30px] lg:text-[40px]">
                Unlock your project’s Potential with BBR
              </h1>
              <p className="text-[#4D4D4D] text-[16px] lg:text-[18px]">
                As a developer in the competitive branded residences market, you
                face challenges across multiple areas: reaching affluent buyers,
                building your brand, shortening sales cycles, and managing
                marketing complexity.
              </p>
            </div>
            <Link
              href="/#"
              className="place-self-start inline-flex place-self-center items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-4 has-[>svg]:px-3 w-fit"
            >
              Get Started -&gt;
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row w-full gap-[24px]">
            <div className="p-[16px] lg:p-[40px] bg-beigeVariant6 rounded-xl flex-3/5">
              <h2 className="text-black text-[22px] lg:text-[28px]">
                Scored list of residences
              </h2>

              <div className="flex w-full flex-1 flex-col lg:flex-row mt-[16px] lg:mt-[40px] gap-[12px]">
                <Image
                  src="/developer-solutions-res-1.webp"
                  alt="countries"
                  width={300}
                  height={100}
                  className="flex flex-1"
                />
                <Image
                  src="/developer-solutions-res-2.webp"
                  alt="countries"
                  width={300}
                  height={100}
                  className="flex flex-1"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[40px] p-[16px] lg:p-[40px] bg-beigeVariant6 rounded-xl flex-2/5">
              <h2 className="text-black text-[22px] lg:text-[28px]">
                Precise Evaluation Criteria
              </h2>

              <Image
                src="/bbr-score-white.webp"
                alt="countries"
                width={300}
                height={200}
                className="flex flex-1 w-full h-ful"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row w-full gap-[24px]">
            <div className="p-[16px] lg:p-[40px] bg-beigeVariant6 rounded-xl flex-1">
              <h2 className="text-black text-[22px] lg:text-[26px]">
                Enhanced Residence Scoring
              </h2>
              <Image
                src="/residence-scoring.webp"
                alt="countries"
                width={400}
                height={400}
                className="mt-[40px] lg:mt-[100px]"
              />
            </div>
            <div className="p-[16px] lg:p-[40px] bg-beigeVariant6 rounded-xl flex-1">
              <h2 className="text-black text-[22px] lg:text-[26px]">
                Track your residences growth
              </h2>
              <Image
                src="/residence-growth.webp"
                alt="countries"
                width={400}
                height={400}
                className="mt-[10px] lg:mt-[30px]"
              />
            </div>
            <div className="p-[16px] lg:p-[40px] bg-beigeVariant6 rounded-xl flex-1">
              <h2 className="text-black text-[22px] lg:text-[26px]">
                Get Matched with AI
              </h2>
              <Image
                src="/ai-match.webp"
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
      <div className="bg-beigeVariant6">
        <SectionLayout>
          <HorizontalTabs tabs={tabs} />
        </SectionLayout>
      </div>

      {/* SIXTH SECTION */}
      <div className="flex flex-col gap-[56px] bg-secondary bg-secondary items-center">
        <SectionLayout>
          <ClientTestimonials />
        </SectionLayout>
      </div>

      {/* SEVENTH SECTION */}
      <SectionLayout>
        <BrandSlider />
      </SectionLayout>
    </div>
  );
};

export default MarketingSolutionsPage;

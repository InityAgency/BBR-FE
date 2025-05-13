import BrandSlider from "@/components/web/Brands/BrandSlider";
import CRLTabs from "@/components/web/CorporateResponsibilityLegal/CRLTabs";
import SectionLayout from "@/components/web/SectionLayout";
import Image from "next/image";
import Link from "next/link";

type CommitmentContent = {
  title: string;
  description: string;
  currentEfforts: string[];
  futureVision: string[];
};

type OurCommitmentProps = {
  content: CommitmentContent[];
};

const OurCommitment = ({ content }: OurCommitmentProps) => {
  return (
    <div className="flex flex-col gap-10">
      {content.map((section, idx) => (
        <div key={idx} className="flex flex-col gap-4">
          <h1 className="text-[#171D22] text-[30px]">{section.title}</h1>

          <p className="text-[18px] text-[#171D22CC] text-justify">
            {section.description}
          </p>

          <div className="flex flex-col gap-2 border-l-1 border-gray-400 px-4">
            <h2 className="text-[#171D22] text-[24px]">
              What We’re Doing Now?
            </h2>
            <ul className="flex flex-col gap-2 list-disc px-10">
              {section.currentEfforts.map((item, index) => (
                <li
                  key={`current-${idx}-${index}`}
                  className="text-black text-[16px] text-justify"
                >
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="text-[#171D22] text-[24px]">
              Our Vision for the Future
            </h2>
            <ul className="flex flex-col gap-2 list-disc px-10">
              {section.futureVision.map((item, index) => (
                <li
                  key={`future-${idx}-${index}`}
                  className="text-black text-[16px] text-justify"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

const tabs = [
  {
    label: "Our Commitment",
    value: "our-commitment",
    content: (
      <OurCommitment
        content={[
          {
            title: "1. Our Commitment to Sustainability",
            description:
              "Before you start picking out furniture or paint colors, take the time to define your vision. What kind of atmosphere do you want your home to have? Do you prefer a modern, minimalist aesthetic, or are you drawn to a more traditional, cozy feel? Creating a vision board with images, colors, and textures that resonate with you can be incredibly helpful.",
            currentEfforts: [
              "Eco-Friendly Residences: We feature residences that already integrate eco-friendly practices such as renewable energy use, sustainable materials, and water conservation.",
              "Green Certification (In Progress): We are developing a certification process to showcase properties that meet sustainability benchmarks like LEED or similar green building standards.",
            ],
            futureVision: [
              "Partnerships with Environmental Organizations: We plan to partner with green organizations to provide developers access to resources for eco-friendly construction and sustainable living.",
              "Carbon Offset Program: We are building a carbon offset program that developers can participate in, helping them enhance their property’s appeal to environmentally conscious buyers.",
            ],
          },
          {
            title: "2. Social & Community Engagement",
            description:
              "As a startup, BBR is committed to building stronger communities. While we are just getting  started, we are developing initiatives to ensure our platform contributes to the social well-being of the  communities where our developers operate.",
            currentEfforts: [
              "Local Community Support: We encourage developers to engage with local economies by hiring  locally, promoting job creation, and supporting community-driven projects.",
              "Initial Charitable Contributions: We are beginning our journey by supporting charitable  initiatives, with plans to formalize this into structured programs over time.",
            ],
            futureVision: [
              "Socially Responsible Developments: We aim to guide developers toward including community enhancing features like affordable housing and public spaces in their projects.",
              "Volunteering Programs: We are working on developing employee and developer volunteer  opportunities that will allow us to give back to the communities we serve.",
            ],
          },
          {
            title: "3. Ethical Business Practices",
            description:
              "From the beginning, BBR has been built on transparency, integrity, and ethical business  practices. We are committed to maintaining these values as we grow.",
            currentEfforts: [
              "Transparency in Rankings: We ensure that our property ranking system is fair, transparent, and  based purely on merit. Developers can trust that their rankings reflect the quality of their work.",
              "Data Privacy and Security: We are already implementing strong data security measures,  adhering to best practices for protecting developer and buyer information.",
            ],
            futureVision: [
              "Enhanced Lead Quality: As we refine our platform, we will introduce more robust systems for  lead generation to ensure developers receive highly qualified leads.",
              "Improved Data Security: As our platform grows, we will implement advanced data protection  protocols, staying compliant with international standards like GDPR.",
            ],
          },
          {
            title: "4. Diversity, Equity, and Inclusion (DEI)",
            description:
              "Diversity, equity, and inclusion are core values for BBR. We recognize that fostering an  inclusive environment benefits both our platform and the communities we serve.",
            currentEfforts: [
              "Inclusive Hiring Practices: We are building a diverse team from the outset and are committed to  creating an inclusive work environment.",
              "Supporting Minority-Owned Developments: BBR is already highlighting minority-owned  developments and ensuring they have visibility on our platform.",
            ],
            futureVision: [
              "Accessible Design: We plan to expand support for developers who focus on accessibility,  encouraging design that accommodates individuals with disabilities.",
              "Formal DEI Initiatives: In the near future, we aim to develop formal DEI programs to guide our  internal operations and developer relations.",
            ],
          },
          {
            title: "5. Governance and Accountability",
            description:
              "As we build BBR, we are setting the foundation for responsible and transparent  governance. Accountability is at the core of how we operate, and we are committed to upholding ethical  standards as we grow.",
            currentEfforts: [
              "Governance Structure: Even as a startup, we’ve established clear governance policies to ensure  ethical leadership across all operations.",
              "Whistleblower Policy: We’ve introduced a basic whistleblower policy that encourages team  members to report unethical behavior.",
            ],
            futureVision: [
              "Third-Party Audits: As we scale, we will conduct regular third-party audits to ensure compliance  with all regulatory standards and maintain our commitment to transparency.",
              "Developer Compliance: We are developing guidelines to help developers comply with ethical,  legal, and environmental regulations.",
            ],
          },
          {
            title:
              "6. Building Our Environmental and Social Governance (ESG) Reporting",
            description:
              "BBR is committed to reporting on our environmental and social impact. Although we are in  the early stages of developing our ESG practices, transparency is a key goal for the long haul.",
            currentEfforts: [
              "Tracking Initial Metrics: We have started tracking key sustainability and social impact metrics as  the foundation of our future ESG reporting.",
            ],
            futureVision: [
              "Annual ESG Reports: As our platform evolves, we aim to release detailed ESG reports annually to  showcase our environmental and social contributions.",
              "Encouraging Developer ESG Reporting: Developers will also have the opportunity to share their  own ESG initiatives, further promoting transparency and responsible business practices.",
            ],
          },
          {
            title: "7. Employee Initiatives",
            description:
              "BBR is more than just a listing platform—we offer hands-on support throughout your development’s journey. From personalized marketing strategy development to ongoing consultations, our team is committed to ensuring your property’s success.",
            currentEfforts: [
              "Work-Life Balance: We promote flexibility and mental health support to ensure a healthy work life balance for our team.",
              "Employee Development: We offer initial training programs focused on sustainability, leadership,  and social responsibility.",
            ],
            futureVision: [
              "Expanded Training and Development: As we grow, we plan to introduce more comprehensive  development programs that focus on professional growth and community engagement.",
            ],
          },
        ]}
      />
    ),
  },
  {
    label: "Social Impact",
    value: "social-impact",
    content: <p className="text-black">Social Impact</p>,
  },
  {
    label: "Ethical Business",
    value: "ethical-business",
    content: <p className="text-black">Ethical Business</p>,
  },
  {
    label: "Inclusion (DEI)",
    value: "inclusion-dei",
    content: <p className="text-black">Inclusion (DEI)</p>,
  },
  {
    label: "Governance and Accountability",
    value: "governance-accountability",
    content: <p className="text-black">Governance and Accountability</p>,
  },
  {
    label: "(ESG) Reporting",
    value: "esg-reporting",
    content: <p className="text-black">(ESG) Reporting</p>,
  },
  {
    label: "Employee Initiatives",
    value: "employee-initiatives",
    content: <p className="text-black">Employee Initiatives</p>,
  },
  {
    label: "Our Global Impact",
    value: "our-global-impact",
    content: <p className="text-black">Our Global Impact</p>,
  },
  {
    label: "A Vision for the Future",
    value: "a-vision-for-the-future",
    content: <p className="text-black">A Vision for the Future</p>,
  },
];

const CorporateResponsibilityLegal = () => {
  return (
    <div>
      {/* FIRST SECTION */}
      <div className="relative flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-8 lg:mb-10">
        <div className="flex flex-col gap-6 w-full bg-secondary bg-black/50 p-2 lg:p-8 py-2 lg:py-[50px] relative overflow">
          <Image
            src="/crl-hero.png"
            alt="about-us"
            fill
            className="w-full h-full object-cover opacity-40 rounded-xl"
          />
          <div className="flex flex-col xl:flex-row justify-between z-10 gap-[50px]">
            <div className="flex flex-col justify-center gap-[16px] text-center p-[20px] lg:p-[150px]">
              <p className="text-primary text-[16px]">
                CORPORATE RESPONSIBILITY
              </p>
              <h1 className="text-[30px] lg:text-[36px]">
                Driving sustainable impact through ethical practices, community
                engagement, and environmental care. Because doing the right
                thing is always good business.
              </h1>
              <Link
                href="/#"
                className="place-self-center h-[50px] inline-flex place-self-center items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-4 has-[>svg]:px-3 w-full md:w-[200px]"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND SECTION */}
      <div className="bg-beigeVariant11">
        <SectionLayout>
          <CRLTabs tabs={tabs} />
        </SectionLayout>
      </div>

      {/* THIRD SECTION */}
      <div className="bg-beigeVariant4">
        <SectionLayout>
          <div className="relative flex flex-col gap-[16px] lg:gap-[20px] bg-beigeVariant6 rounded-xl px-[12px] py-[24px] lg:py-[66px] items-center">
            <Image
              src="/texture.webp"
              alt="about-us"
              fill
              className="w-full h-full object-cover opacity-80"
            />
            <h1 className="text-black text-[24px] lg:text-[40px] lg:w-[70%] text-center">
              Join the Best and Elevate Your Branded Residence
            </h1>
            <p className="text-black text-[14px] lg:text-[18px] lg:w-[70%] text-center">
              BBR is a startup with a vision for the future. While we are in the
              early stages, we are committed to building a platform that
              promotes sustainability, ethical business practices, and social
              impact. Join us as we grow, and together, we can create a better
              future for the luxury real estate market and the world.
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

export default CorporateResponsibilityLegal;

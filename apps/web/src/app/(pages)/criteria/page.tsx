"use client";
import { Button } from "@/components/ui/button";
import FaqBlock from "@/components/web/Faq/FaqBlock";
import Image from "next/image";

export default function EvaluationCriteriaPage() {
  return (
    <div>
      {/* FIRST SECTION */}
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-20">
        <div className="relative flex flex-col gap-6 w-full rounded-xl bg-black/50 p-4 lg:p-8 py-12 lg:py-32 relative overflow-hidden">
          <Image
            src="/criteria-hero.jpg"
            alt="about-us"
            fill
            className="w-full h-full object-cover opacity-40"
          />
          <div className="flex flex-col align-center z-10">
            <svg
              className="absolute top-0 left-1/2"
              width="58"
              height="54"
              viewBox="0 0 58 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0H58V25C58 41.0163 45.0163 54 29 54C12.9837 54 0 41.0163 0 25V0Z"
                fill="#B3804C"
              />
              <path
                d="M15.6668 14.3333L19.6668 30.3333H38.3335L42.3335 14.3333L34.3335 23.6666L29.0001 14.3333L23.6668 23.6666L15.6668 14.3333ZM19.6668 35.6666H38.3335H19.6668Z"
                fill="url(#paint0_linear_1687_15537)"
              />
              <path
                d="M19.6668 35.6666H38.3335M15.6668 14.3333L19.6668 30.3333H38.3335L42.3335 14.3333L34.3335 23.6666L29.0001 14.3333L23.6668 23.6666L15.6668 14.3333Z"
                stroke="url(#paint1_linear_1687_15537)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1687_15537"
                  x1="29.0001"
                  y1="14.3333"
                  x2="29.0001"
                  y2="35.6666"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#F5F3F6" />
                  <stop offset="1" stopColor="#BBA568" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_1687_15537"
                  x1="29.0001"
                  y1="14.3333"
                  x2="29.0001"
                  y2="35.6666"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#F5F3F6" />
                  <stop offset="1" stopColor="#BBA568" />
                </linearGradient>
              </defs>
            </svg>
            <h1 className="text-[52px] text-left lg:text-center w-full lg:w-[55%] mx-auto">
              Shaping the Future of Luxury Real Estate Discovery
            </h1>
            <p className="font-normal lg:text-xl w-full text-left lg:text-center mx-auto text-white">
              We blend AI technology with human insight to evaluate the world’s
              most exceptional branded residences.
            </p>
            <svg
              className="place-self-center mt-[50px]"
              width="42"
              height="50"
              viewBox="0 0 42 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 1.66667V48.3333M21 48.3333L1 28.3333M21 48.3333L41 28.3333"
                stroke="#E8F3F6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* SECOND SECTION */}
      <div className="relative mx-[30px] lg:mx-[120px] mb-20">
        <div className="flex flex-col bg-secondary rounded-xl w-full">
          <div className="flex flex-1 px-[70px] items-center py-[64px] gap-[100px]">
            <Image
              src="/evaluation-top-residence.png"
              alt="about-us"
              width={690}
              height={560}
              className="h-full w-[50%] rounded mt-[24px]"
            />
            <div className="flex flex-col w-[55%] gap-[24px]">
              <h1 className="text-center 2xl:text-[56px] text-[40px] text-left mx-auto">
                What Makes a Top Residence?
              </h1>
              <p className="text-md text-justify text-[20px] mx-auto text-white">
                We don’t just list properties—we evaluate them. Every ranked
                residence is scored through a dynamic system that adapts to
                context, location, lifestyle, and value potential. Our model
                evolves as the market does, powered by AI and verified by expert
                review.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => {}}
                  className="place-self-start lg:place-self-center"
                >
                  Get Matched
                </Button>
                <Button
                  onClick={() => {}}
                  variant="outline"
                  className="place-self-start lg:place-self-center"
                >
                  Explore residences
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THIRD SECTION */}
      <div className="bg-beigeVariant1 px-[120px] py-[96px]">
        <h1 className="text-secondary text-[56px] mb-[24px]">
          Our Ranking Evaluation Pillars
        </h1>
        <div className="flex gap-[200px]">
          <div className="flex place-self-end gap-[12px]">
            <Button
              onClick={() => {}}
              className="place-self-start lg:place-self-center"
            >
              Get Matched
            </Button>
            <Button
              onClick={() => {}}
              variant="outline"
              className="place-self-start lg:place-self-center text-blackBlueVariant1 hover:text-blackBlueVariant1/50 !border-blackBlueVariant1"
            >
              Explore residences
            </Button>
          </div>
          <p className="text-blackBlueVariant1 w-[50%] text-justify">
            We don’t just list properties—we evaluate them. Every ranked
            residence is scored through a dynamic system that adapts to context,
            location, lifestyle, and value potential. Our model evolves as the
            market does, powered by AI and verified by expert review.
          </p>
        </div>
        <div className="flex mt-[56px] gap-[24px]">
          <div className="flex flex-col bg-secondary h-[500px] w-[540px] rounded-xl p-[32px]">
            <h1 className="text-[36px] mb-[24px]">Location & Area</h1>
            <h2 className="text-justify text-[18px]">
              The foundation of every exceptional residence is where it stands.
              We assess the micro and macro context — proximity to landmarks,
              cultural richness, safety, connectivity, and long-term
              desirability. Only destinations with global prestige and local
              charm meet our criteria.
            </h2>
            <Image
              src="/location-are-image.png"
              alt="about-us"
              width={200}
              height={480}
              className="max-h-[200px] w-full rounded mt-[24px]"
            />
          </div>
          <div className="text-black place-self-center">
            PLACE CAROUSEL HERE
          </div>
        </div>
      </div>

      {/* FOURTH SECTION */}
      <div className="bg-white px-[120px] py-[84px]">
        <div className="flex flex-col gap-[56px] bg-beigeVariant2 rounded-xl p-[64px]">
          <div className="flex gap-[48px]">
            <h1 className="text-[56px] text-black w-[50%]">
              The Evaluation Process
              <span className="text-primary"> AI-Powered.</span> Expert-Curated
            </h1>
            <h2 className="text-[18px] text-blackBlueVariant1 w-[50%] place-self-end">
              Evaluation criteria are essential for assessing property quality
              and helping buyers make informed decisions. Properties are
              evaluated based on factors such as location, design, amenities,
              sustainability, and overall value. These assessments help buyers
              understand the unique strengths of each residence, allowing for
              meaningful comparisons and guiding purchasing decisions.
            </h2>
          </div>
          <div className="flex gap-[40px]">
            <div className="flex flex-col gap-[44px]">
              <div className="flex gap-[24px]">
                <Image
                  src="/icons/evaluation-home.svg"
                  width={65}
                  height={65}
                  alt="home-icon"
                  className="place-self-start"
                />
                <div>
                  <h2 className="text-[24px] text-blackBlueVariant1">
                    Developers Submit their Residences
                  </h2>
                  <h3 className="text-[18px] text-blackBlueVariant1">
                    Developers submit detailed profiles of their branded
                    residences, showcasing their unique features, amenities, and
                    lifestyle offerings to be considered for ranking.
                  </h3>
                </div>
              </div>

              <div className="flex gap-[24px]">
                <Image
                  src="/icons/evaluation-medal.svg"
                  width={65}
                  height={65}
                  alt="home-icon"
                  className="place-self-start"
                />
                <div>
                  <h2 className="text-[24px] text-blackBlueVariant1">
                    BBR Evaluates and Ranks with AI Empowerment
                  </h2>
                  <h3 className="text-[18px] text-blackBlueVariant1">
                    Developers submit detailed profiles of their branded
                    residences, showcasing their unique features, amenities, and
                    lifestyle offerings to be considered for ranking.
                  </h3>
                </div>
              </div>

              <div className="flex gap-[24px]">
                <Image
                  src="/icons/evaluation-building.svg"
                  width={65}
                  height={65}
                  alt="home-icon"
                  className="place-self-start"
                />
                <div>
                  <h2 className="text-[24px] text-blackBlueVariant1">
                    You Explore the Top-Ranked Residences
                  </h2>
                  <h3 className="text-[18px] text-blackBlueVariant1">
                    Developers submit detailed profiles of their branded
                    residences, showcasing their unique features, amenities, and
                    lifestyle offerings to be considered for ranking.
                  </h3>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-[400px] bg-white rounded-xl px-[32px] py-[24px] min-w-[470px] gap-[24px]">
              <h1 className="text-[28px] text-blackBlueVariant1">Benefits</h1>
              <div className="flex gap-[12px]">
                <Image
                  src="/icons/evaluation-star.svg"
                  width={18}
                  height={18}
                  alt="home-icon"
                  className="place-self-center"
                />
                <p className="text-blackBlueVariant1">
                  Gain confidence in the quality and value of potential
                  properties.
                </p>
              </div>
              <div className="flex gap-[12px]">
                <Image
                  src="/icons/evaluation-star.svg"
                  width={18}
                  height={18}
                  alt="home-icon"
                  className="place-self-center"
                />
                <p className="text-blackBlueVariant1">
                  Compare residences based on transparent and expert-led
                  assessments.
                </p>
              </div>
              <div className="flex gap-[12px]">
                <Image
                  src="/icons/evaluation-star.svg"
                  width={18}
                  height={18}
                  alt="home-icon"
                  className="place-self-center"
                />
                <p className="text-blackBlueVariant1">
                  Focus on properties that match your specific lifestyle,
                  preferences, and needs.
                </p>
              </div>
              <div className="flex gap-[12px]">
                <Image
                  src="/icons/evaluation-star.svg"
                  width={18}
                  height={18}
                  alt="home-icon"
                  className="place-self-center"
                />
                <p className="text-blackBlueVariant1">
                  Access a curated list of top-performing branded residences in
                  your desired location.
                </p>
              </div>
              <Button variant="secondary" onClick={() => {}} className="w-full">
                See all rankings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* FIFTH SECTION */}
      <div className="flex bg-beigeVariant1 px-[120px] py-[96px] gap-[56px]">
        <Image
          src="/evaluation-custom-rankings.png"
          alt="about-us"
          width={780}
          height={530}
          className="h-full w-[50%] rounded mt-[24px]"
        />
        <div className="flex flex-col w-[50%] gap-[24px]">
          <h1 className="text-center text-black 2xl:text-[56px] text-[40px] text-left mx-auto">
            Custom Rankings. Relevant Comparisons.
          </h1>
          <p className="text-md text-black text-justify text-[20px] mx-auto">
            A truly exceptional branded residence does more than borrow a name —
            it embodies a brand’s essence in every touchpoint, from architecture
            to service rituals. We evaluate the depth of brand integration,
            emotional connection, and how uniquely the property stands out
            within its market and brand category.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => {}}
              className="place-self-start lg:place-self-center"
            >
              Get Matched
            </Button>
            <Button
              onClick={() => {}}
              variant="outline"
              className="place-self-start lg:place-self-center text-blackBlueVariant1 hover:text-blackBlueVariant1/50 !border-blackBlueVariant1"
            >
              Explore residences
            </Button>
          </div>
        </div>
      </div>

      <FaqBlock />
    </div>
  );
}

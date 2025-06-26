import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import SectionLayout from "@/components/web/SectionLayout";
import { ArrowRight } from "lucide-react";
import RequestConsultationForm from "@/components/web/Forms/RequestConsultation";
import BrandSlider from "@/components/web/Brands/BrandSlider";
import { LatestPosts } from "@/components/web/Posts/LatestPosts";
import ResidencesSlider from "@/components/web/Residences/ResidencesSlider";
import BestResidencesSection from "@/components/web/Sections/BestResidencesSection";
import PopularPlaces from "@/components/web/Sections/PopularPlaces";
import HomeSearchForm from "@/components/web/Forms/HomeSearchForm";

import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next'
import ListResidenceButton from "@/components/web/Buttons/ListResidenceButton";
import GetMatchedButton from "@/components/web/Buttons/GetMatchedButton";

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Best Branded Residences: Rankings & Reviews by Country, City, & Lifestyle',
    description: 'We review & rate the world’s Best Branded Residences, from Miami to Dubai. Verified properties globally by country, city, lifestyle, or investment opportunities',
    keywords: ['luxury residences', 'branded residences', 'real estate', 'luxury homes']
  }
})


export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 mb-3 lg:mb-12">
        <div className="w-full xl:max-w-[1600px] mx-auto flex flex-col lg:items-center gap-2 lg:gap-6">
          <h1 className="text-4xl lg:text-6xl font-bold w-full xl:w-[80%] text-left lg:text-center mt-0 lg:mt-8">Your Trusted Guide to the World's Best Branded Residences</h1>
          <p className="text-md lg:text-xl w-full xl:w-[60%] text-left lg:text-center">
            From Four Seasons to Armani, explore a curated collection of high-end homes offering world-class service, private amenities, and investment value.
          </p>
        </div>
        <div className="home-form w-full">
          <HomeSearchForm />
        </div>
        <div className="w-full xl:max-w-[1600px] mx-auto">
          <Image src="/hero-image.webp" alt="Hero Image" width={1000} height={1000} className="w-full rounded-2xl mt-6" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 xl:max-w-[1600px] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-8 mb-12 ">
        <div className="flex flex-col items-center justify-center w-full lg:w-1/4">
          <h2 className="text-4xl font-bold">1000+</h2>
          <p className="text-md lg:text-lg">Properties Ranked</p>
        </div>
        <div className="flex flex-col items-center justify-center w-full lg:w-1/4">
          <h2 className="text-4xl font-bold">150+</h2>
          <p className="text-md lg:text-lg">Ranking Categories</p>
        </div>
        <div className="flex flex-col items-center justify-center w-full lg:w-1/4">
          <h2 className="text-4xl font-bold">100</h2>
          <p className="text-md lg:text-lg">Luxury brands</p>
        </div>
        <div className="flex flex-col items-center justify-center w-full lg:w-1/4">
          <h2 className="text-4xl font-bold">5.0</h2>
          <p className="text-md lg:text-lg">Star Customer Ratings</p>
        </div>
      </div>

      <section className="residences">
        <SectionLayout>
          <BestResidencesSection />
        </SectionLayout>
      </section>


      <section className="ranking-crieteria bg-secondary mb-12">
        <SectionLayout>
          <div className="flex flex-col gap-4 w-full">
            <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full">IMPECCABLE RANKING CRITERIA</span>
            <h2 className="text-4xl font-bold w-[100%] lg:w-[60%] text-left lg:text-center mx-auto">Find your new home or investment from the World's Best</h2>
            <p className="text-md lg:text-lg w-full lg:w-[60%] text-left lg:text-center mx-auto text-white/70">Best Branded Residences help you choose a private residence partner or property that is right for you by giving expert insights, offers & ratings</p>
          </div>
          <div>
            <div className="flex flex-col lg:flex-row gap-4 mt-8 max-w-[85%] xl:max-w-[1600px] mx-auto">
              <div className="flex flex-row gap-4 items-center w-full">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="61" viewBox="0 0 80 81" fill="none">
                    <path d="M46.6615 64.7857L52.6615 70.5L66.6615 57.1667M54.9948 48.5058C54.0121 47.9383 52.9228 47.5325 51.7623 47.3241C51.511 47.279 51.2443 47.2468 50.9422 47.2238C50.1914 47.1667 49.816 47.1382 49.3152 47.1755C48.7945 47.2144 48.5037 47.2657 48.0011 47.4075C47.5178 47.5439 46.647 47.9383 44.9054 48.7273C42.3917 49.866 39.6006 50.5 36.6615 50.5C33.7223 50.5 30.9312 49.866 28.4175 48.7273C26.6757 47.9383 25.8049 47.5438 25.3214 47.4074C24.8188 47.2656 24.5275 47.2142 24.0068 47.1754C23.5058 47.1381 23.1308 47.1667 22.3806 47.2239C22.0738 47.2473 21.8031 47.2802 21.5467 47.3266C17.4429 48.0696 14.231 51.2814 13.4881 55.3853C13.3281 56.2688 13.3281 57.3282 13.3281 59.447V65.1667C13.3281 67.0335 13.3281 67.9669 13.6914 68.68C14.011 69.3072 14.5209 69.8171 15.1482 70.1367C15.8612 70.5 16.7946 70.5 18.6615 70.5H34.9948M49.9948 23.8333C49.9948 31.1971 44.0253 37.1667 36.6615 37.1667C29.2977 37.1667 23.3281 31.1971 23.3281 23.8333C23.3281 16.4695 29.2977 10.5 36.6615 10.5C44.0253 10.5 49.9948 16.4695 49.9948 23.8333Z" stroke="#B3804C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl lg:text-2xl font-bold">Trusted Rankings</h3>
                  <p>Buying a branded residence is a significant investment—our rankings help you make the best choice with confidence.</p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-center w-full">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="61" viewBox="0 0 80 81" fill="none">
                    <path d="M16.6667 53.833V67.1663M20 13.833V27.1663M23.3333 60.4997H10M26.6667 20.4997H13.3333M43.3333 13.833L49.1761 28.6476C49.8025 30.2358 50.1157 31.0299 50.5952 31.6995C51.0203 32.293 51.54 32.8127 52.1335 33.2378C52.8031 33.7173 53.5972 34.0305 55.1854 34.6569L70 40.4997L55.1854 46.3425C53.5972 46.9688 52.8031 47.282 52.1335 47.7616C51.54 48.1867 51.0203 48.7063 50.5952 49.2999C50.1157 49.9695 49.8025 50.7636 49.1761 52.3518L43.3333 67.1663L37.4906 52.3518C36.8642 50.7636 36.551 49.9695 36.0714 49.2999C35.6464 48.7063 35.1267 48.1867 34.5331 47.7616C33.8635 47.282 33.0694 46.9688 31.4812 46.3425L16.6667 40.4997L31.4812 34.6569C33.0694 34.0305 33.8635 33.7173 34.5331 33.2378C35.1267 32.8127 35.6464 32.293 36.0714 31.6995C36.551 31.0299 36.8642 30.2358 37.4906 28.6476L43.3333 13.833Z" stroke="#B3804C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl lg:text-2xl font-bold capitalize">Informed Decisions</h3>
                  <p>Our ranking system is built on comprehensive research, expert reviews, and buyer insights, offering a transparent, data-backed evaluation process.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 mt-4 border rounded-2xl p-6 relative w-full xl:max-w-[1600px] mx-auto">
            <Image src="/ranking-criteria-1.webp" alt="Ranking Image" width={1000} height={1000} className="w-full lg:max-w-[32.5%] flex-1 rounded-lg object-cover" />
            <Image src="/ranking-criteria-2.webp" alt="Ranking Image" width={1000} height={1000} className="w-full lg:max-w-[32.5%] flex-1 rounded-lg object-cover" />
            <Image src="/ranking-criteria-3.webp" alt="Ranking Image" width={1000} height={1000} className="w-full lg:max-w-[32.5%] flex-1 rounded-lg object-cover" />
            <Image src="/stats.png" alt="Ranking Image" width={1000} height={1000} className="w-[55%] rounded-xl object-contain absolute -bottom-10 left-1/2 transform -translate-x-1/2" />
          </div>
        </SectionLayout>
      </section>

      <section className="popular-places mb-12">
        <SectionLayout>
          <PopularPlaces />
        </SectionLayout>
      </section>

      <section className="new-solution-section xl:max-w-[1600px] mx-auto">
        <SectionLayout className="bg-secondary rounded-2xl">
          <div className="flex flex-col gap-4 lg:gap-8 xl:gap-12 items-center px-4 py-12 lg:px-0 lg:py-0">
            <div className="flex flex-col gap-4">
              <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full">NEW SOLUTION</span>
              <h2 className="text-4xl font-bold w-[100%] lg:w-[60%] text-left lg:text-center mx-auto">The Smartest Way to Buy, Invest & Discover Branded Residences</h2>
              <p className="text-md lg:text-lg w-full lg:w-[60%] text-left lg:text-center mx-auto text-white/70">
                From iconic penthouses to high-ROI investments, explore properties ranked by trust, quality, and long-term value.
              </p>
            </div>
            <div className="new-solution-section-content grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="flex flex-col justify-center w-full bg-zinc-500/10 rounded-2xl p-6">
                <div className="flex flex-row gap-4 items-center mb-4">
                  <div className="relative">
                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-8 lg:w-12 h-8 lg:h-12"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <path d="M17 25L20.0178 28.0178C20.7053 28.7053 21.0491 29.0491 21.4396 29.1643C21.7827 29.2656 22.1499 29.2489 22.4824 29.117C22.8609 28.9669 23.1722 28.5934 23.7946 27.8465L32 18M32.6575 9.5171C34.1351 9.55927 35.6001 10.1442 36.7279 11.272C37.8557 12.3998 38.4407 13.8648 38.4828 15.3424C38.5246 16.8046 38.5454 17.5357 38.5883 17.7059C38.6802 18.0702 38.5735 17.8125 38.7661 18.135C38.8561 18.2857 39.3584 18.8175 40.3627 19.8809C41.3777 20.9556 42 22.4051 42 24C42 25.5949 41.3777 27.0444 40.3627 28.1191C39.3584 29.1825 38.8561 29.7143 38.7661 29.865C38.5735 30.1875 38.6802 29.9298 38.5883 30.2941C38.5454 30.4643 38.5246 31.1954 38.4828 32.6576C38.4407 34.1352 37.8557 35.6002 36.7279 36.728C35.6001 37.8558 34.1351 38.4407 32.6575 38.4829C31.1953 38.5246 30.4642 38.5455 30.294 38.5884C29.9298 38.6803 30.1874 38.5735 29.8649 38.7661C29.7142 38.8561 29.1825 39.3584 28.1191 40.3627C27.0444 41.3777 25.5949 42 24 42C22.4051 42 20.9556 41.3777 19.8809 40.3628C18.8175 39.3583 18.2857 38.8561 18.1351 38.7661C17.8125 38.5735 18.0702 38.6802 17.7059 38.5884C17.5358 38.5455 16.8045 38.5246 15.3424 38.4829C13.8648 38.4407 12.3997 37.8558 11.2719 36.728C10.1441 35.6002 9.55918 34.1351 9.51703 32.6575C9.47533 31.1953 9.45447 30.4642 9.41156 30.294C9.3197 29.9298 9.42643 30.1874 9.23382 29.8649C9.14384 29.7142 8.64164 29.1825 7.63723 28.119C6.62226 27.0444 6 25.5949 6 24C6 22.4051 6.62226 20.9556 7.63723 19.881C8.64164 18.8175 9.14384 18.2858 9.23382 18.1351C9.42643 17.8126 9.3197 18.0702 9.41156 17.706C9.45447 17.5358 9.47533 16.8047 9.51703 15.3425C9.55918 13.8649 10.1441 12.3998 11.2719 11.272C12.3997 10.1442 13.8648 9.55926 15.3424 9.5171C16.8046 9.47539 17.5358 9.45453 17.7059 9.41162C18.0702 9.31976 17.8125 9.4265 18.1351 9.23388C18.2857 9.14389 18.8175 8.64164 19.8809 7.63725C20.9556 6.62226 22.4051 6 24 6C25.5949 6 27.0444 6.62227 28.1191 7.63728C29.1825 8.64168 29.7142 9.14388 29.8649 9.23386C30.1874 9.42648 29.9298 9.31975 30.294 9.41161C30.4642 9.45452 31.1953 9.47538 32.6575 9.5171Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold">Verified Global Luxury Residences</h3>
                </div>
                <p>Every property is carefully vetted for quality, prestige, and long-term value.</p>
              </div>

              <div className="flex flex-col justify-center w-full bg-zinc-500/10 rounded-2xl p-6">
                <div className="flex flex-row gap-4 items-center mb-4">
                  <div className="relative">
                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-8 lg:w-12 h-8 lg:h-12"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <path d="M44 16H40M40 16H38C34 12.0036 28 7.9996 24 12M40 16V32M24 12L17.9991 18.0033C17.8404 18.1621 17.761 18.2414 17.6972 18.3117C16.31 19.8379 16.3106 22.1686 17.6985 23.6941C17.7624 23.7643 17.842 23.8438 18.0006 24.0024C18.1593 24.161 18.2387 24.2403 18.309 24.3042C19.8349 25.6908 22.1647 25.6904 23.6902 24.3033C23.7604 24.2395 23.8398 24.1601 23.9984 24.0014L25.9992 22.0007M24 12C20 7.9996 14 12.0037 10 16.0001H8M4 16.0001H8M8 16.0001V32M40 32V38H44M40 32H34.3431M30 26L33 29C33.1592 29.1592 33.239 29.239 33.3031 29.3095C34.6898 30.8351 34.6898 33.1649 33.3031 34.6905C33.239 34.761 33.1592 34.8408 33 35C32.8408 35.1592 32.761 35.239 32.6905 35.3031C31.1649 36.6899 28.8351 36.6899 27.3095 35.3031C27.239 35.239 27.1592 35.1592 27 35L26 34C24.9095 35.0905 24.3643 35.6358 23.7761 35.9272C22.657 36.4818 21.343 36.4818 20.2239 35.9272C19.6358 35.6358 19.0905 35.0905 18 34C16.6217 35.8378 13.7913 35.5825 12.7639 33.5279L12 32H8M8 32V38H4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold capitalize">Exclusive Developer Partnerships</h3>
                </div>
                <p>Get direct access to top-tier branded residences from leading global developers.</p>
              </div>

              <div className="flex flex-col justify-center w-full bg-zinc-500/10 rounded-2xl p-6">
                <div className="flex flex-row gap-4 items-center mb-4">
                  <div className="relative">
                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-8 lg:w-12 h-8 lg:h-12"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <path d="M42 42H15.6C12.2397 42 10.5595 42 9.27606 41.346C8.14708 40.7708 7.2292 39.8529 6.65396 38.7239C6 37.4405 6 35.7603 6 32.4V6M12 30L20 22L28 30L40 18M40 18V26M40 18H32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold capitalize">Data-Driven Investment Insights</h3>
                </div>
                <p>Access ROI projections, rental yield reports, and market trends to make smarter buying decisions.	</p>
              </div>

              <div className="flex flex-col justify-center w-full bg-zinc-500/10 rounded-2xl p-6">
                <div className="flex flex-row gap-4 items-center mb-4">
                  <div className="relative">
                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-8 lg:w-12 h-8 lg:h-12"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <path d="M10.0012 14V22M20.0012 4V12M36.0012 32V40M6.00116 18H14.0012M16.0012 8H24.0012M32.0012 36H40.0012M28.0012 14L33.658 19.6569M39.0344 7.49223L40.1658 8.6236C40.9578 9.41564 41.3538 9.81166 41.5022 10.2683C41.6327 10.67 41.6327 11.1027 41.5022 11.5044C41.3538 11.961 40.9578 12.3571 40.1658 13.1491L13.0521 40.2628C12.2601 41.0548 11.8641 41.4508 11.4074 41.5992C11.0057 41.7297 10.573 41.7297 10.1713 41.5992C9.71467 41.4508 9.31866 41.0548 8.52662 40.2628L7.39525 39.1314C6.60322 38.3394 6.2072 37.9433 6.05882 37.4867C5.92831 37.085 5.92831 36.6523 6.05882 36.2506C6.2072 35.794 6.60322 35.3979 7.39525 34.6059L34.5089 7.49224C35.301 6.7002 35.697 6.30418 36.1536 6.15581C36.5553 6.02529 36.988 6.02529 37.3897 6.15581C37.8464 6.30418 38.2424 6.7002 39.0344 7.49223Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold capitalize">AI-Powered Property Matchmaking</h3>
                </div>
                <p>Our SmartMatch AI recommends the best properties based on your goals, lifestyle, and budget.	</p>
              </div>

              <div className="flex flex-col justify-center w-full bg-zinc-500/10 rounded-2xl p-6">
                <div className="flex flex-row gap-4 items-center mb-4">
                  <div className="relative">
                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-8 lg:w-12 h-8 lg:h-12"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <path d="M21 42H8C8 34.9471 13.2154 29.1122 20 28.1418M32.9952 32.4239C31.5957 30.8656 29.2618 30.4464 27.5083 31.8733C25.7547 33.3003 25.5079 35.686 26.8849 37.3736C27.6624 38.3264 29.5095 39.9967 30.9708 41.2706C31.6638 41.8748 32.0103 42.1769 32.4294 42.3005C32.7867 42.4059 33.2037 42.4059 33.561 42.3005C33.9801 42.1769 34.3266 41.8748 35.0196 41.2706C36.4809 39.9967 38.328 38.3264 39.1055 37.3736C40.4825 35.686 40.2658 33.2852 38.4821 31.8733C36.6984 30.4614 34.3948 30.8656 32.9952 32.4239ZM30 14C30 18.4183 26.4183 22 22 22C17.5817 22 14 18.4183 14 14C14 9.58172 17.5817 6 22 6C26.4183 6 30 9.58172 30 14Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold capitalize">First People oriented real-estate platform </h3>
                </div>
                <p>Real estate should be about people, not just properties. We connect buyers, investors, and developers with curated listings - ensuring a seamless, personalized experience.	</p>
              </div>

              <div className="flex flex-col justify-center w-full bg-zinc-500/10 rounded-2xl p-6">
                <div className="flex flex-row gap-4 items-center mb-4">
                  <div className="relative">
                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-8 lg:w-12 h-8 lg:h-12"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <path d="M24 28V34M24 28C19.1621 28 15.1266 24.5645 14.2 20M24 28C28.8379 28 32.8734 24.5645 33.8 20M34 10H39.5C39.9647 10 40.197 10 40.3902 10.0384C41.1836 10.1962 41.8038 10.8164 41.9616 11.6098C42 11.803 42 12.0353 42 12.5C42 13.894 42 14.5909 41.8847 15.1705C41.4113 17.5507 39.5507 19.4113 37.1705 19.8847C36.5909 20 35.894 20 34.5 20H34H33.8M14 10H8.5C8.03534 10 7.80302 10 7.60982 10.0384C6.81644 10.1962 6.19624 10.8164 6.03843 11.6098C6 11.803 6 12.0353 6 12.5C6 13.894 6 14.5909 6.11529 15.1705C6.58873 17.5507 8.44931 19.4113 10.8295 19.8847C11.4091 20 12.106 20 13.5 20H14H14.2M24 34C25.8599 34 26.7899 34 27.5529 34.2044C29.6235 34.7592 31.2408 36.3765 31.7956 38.4471C32 39.2101 32 40.1401 32 42H16C16 40.1401 16 39.2101 16.2044 38.4471C16.7592 36.3765 18.3765 34.7592 20.4471 34.2044C21.2101 34 22.1401 34 24 34ZM14.2 20C14.0689 19.3538 14 18.6849 14 18V9.14286C14 8.07663 14 7.54351 14.1981 7.13223C14.3946 6.72402 14.724 6.39465 15.1322 6.19806C15.5435 6 16.0766 6 17.1429 6H30.8571C31.9234 6 32.4565 6 32.8678 6.19806C33.276 6.39465 33.6054 6.72402 33.8019 7.13223C34 7.54351 34 8.07663 34 9.14286V18C34 18.6849 33.9311 19.3538 33.8 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold">Industry-Leading Rankings & Ratings</h3>
                </div>
                <p>Discover the Top 10 luxury homes, best high-rise investments, and top waterfront properties.	</p>
              </div>
            </div>
          </div>
        </SectionLayout>
      </section>

      <section className="residences-section">
        <SectionLayout>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-16 items-center px-4 py-12 pb-4 lg:pb-0 lg:px-0 lg:py-0 w-full xl:max-w-[1600px] mx-auto">
            <div className="residences-section-header flex flex-col lg:flex-row w-full items-end gap-4 lg:gap-0 xl:max-w-[1600px] mx-auto">
              <div className="w-full flex flex-col gap-4">
                <span className="text-md lg:text-lg text-left lg:text-left text-primary w-full uppercase">EXPLORE NEW</span>
                <h2 className="text-4xl font-bold w-fulltext-left lg:text-left">
                  Newly Added Residences
                </h2>
              </div>
              <Link href="/residences" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-full lg:w-fit">
                View All Residences
              </Link>
            </div>
          </div>
          <div className="w-full xl:max-w-[1600px] mx-auto">
            <ResidencesSlider />
          </div>
        </SectionLayout>
      </section>

      <section className="matchmaking-tool bg-secondary">
        <SectionLayout>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 xl:gap-24 items-center px-4 py-12 lg:px-0 lg:py-0 xl:max-w-[1600px] mx-auto">
            <div className="w-full">
              <span className="text-md lg:text-lg text-left lg:text-left text-primary">MATCHMAKING TOOL</span>
              <h2 className="text-4xl font-bold text-left mx-auto mb-4 mt-4 w-full">AI Matchmaking Tool – Find Your Perfect Fit</h2>
              <p className="text-md mb-4 text-white/70">
                Answer a few quick questions, and let our AI match you with residences that fit your lifestyle and investment goals.
              </p>
              <div className="flex gap-2 flex-wrap">
                <GetMatchedButton />
                {/* <Link href="/" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 bg-white/5 hover:bg-white/10 text-white border-[#b3804c] w-full lg:w-fit">Learn more</Link> */}
              </div>
            </div>
            <div className="w-full border rounded-xl p-4">
              <Image src="/matchmaking-tool-section.webp" width={1000} height={1000} alt="matchmaking-tool" />
            </div>
          </div>
        </SectionLayout>
      </section>

      <section className="exclusive-offers bg-secondary">
        <SectionLayout>
          <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-8 xl:gap-24 items-center px-4 py-12 lg:px-0 lg:py-0 xl:max-w-[1600px] mx-auto">
            <div className="w-full relative">
              <Image src="/exclusive-offers-badges.webp" width={500} height={500} className="w-[50%] h-[50%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" alt="exclusive-offers-badges" />
              <Image src="/exclusive-offers-section.webp" width={1000} height={500} className="w-full h-full" alt="exclusive-offers-section" />
            </div>
            <div className="w-full">
              <span className="text-md lg:text-lg text-left lg:text-left text-primary">EXCLUSIVE OFFERS</span>
              <h2 className="text-4xl font-bold text-left mx-auto mb-4 mt-4 w-full">Exclusive Deals You Won't Find Anywhere Else</h2>
              <p className="mb-4 text-white/70">
                We've partnered with your favourite developers to get you exclusive offers on their inventory available only to our buyers.
              </p>
              <Link href="/exclusive-deals?page=1" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-full lg:w-fit m-auto">
                Get exclusive deals
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </SectionLayout>
      </section>

      <section className="blog-section px-4 lg:px-0 py-8 lg:py-0">
        <SectionLayout>
          <div className="blog-section-header flex flex-col lg:flex-row w-full items-end gap-4 lg:gap-0 xl:max-w-[1600px] mx-auto">
            <div className="w-full flex flex-col gap-4">
              <span className="text-md lg:text-lg text-left lg:text-left text-primary w-full uppercase">LATEST NEWS</span>
              <h2 className="text-4xl font-bold w-[100%] lg:w-[80%] xl:w-[80%] text-left lg:text-left">
                Stay Ahead with Luxury Real Estate Insights
              </h2>
            </div>
            <Link href="/blog" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-full lg:w-fit ">
              Read all insights
            </Link>
          </div>

          <div className="blgo-section-content mt-8 xl:max-w-[1600px] mx-auto">
            <LatestPosts />
          </div>
        </SectionLayout>
      </section>

      <section className="brand-slider px-4 lg:px-0 py-8 lg:py-0">
        <SectionLayout>
          <div className="flex flex-col items-center gap-4 xl:max-w-[1600px] mx-auto">
            <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full">BRANDS AND DEVELOPERS</span>
            <h2 className="text-4xl font-bold w-[100%] lg:w-[65%] text-left lg:text-center mx-auto">
              Showcasing residences from most exclusive brands & developers
            </h2>
          </div>
          <div className="w-full xl:max-w-[1600px] mx-auto">
            <BrandSlider />
          </div>
        </SectionLayout>
      </section>

      <section className="get-in-touch px-4 lg:px-0 py-12 lg:py-0 bg-secondary mb-8 lg:mb-0">
        <SectionLayout>
          <div className="border rounded-xl p-4 lg:py-8 flex flex-col lg:flex-row gap-8 xl:max-w-[1600px] mx-auto">
            <div className="w-full lg:flex lg:flex-col">
              <div className="flex flex-col">
                <span className="text-md lg:text-lg text-left lg:text-left text-primary">GET IN TOUCH</span>
                <h2 className="text-4xl font-bold text-left mx-auto mb-4 mt-4 w-full capitalize">Connect with Our Experts</h2>
                <p className="text-md text-white/70">
                  Have questions or need personalized assistance? Our dedicated consultants provide tailored guidance, ensuring you make the right investment choices with confidence.
                  <br /><br />
                  Whether you are looking for a luxury home, a profitable investment, or an exclusive lifestyle experience, our consultants are here to help.
                </p>
                <Link href="/schedule-a-demo" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-full lg:w-fit mt-4">
                  Schedule a consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-8 lg:flex-grow lg:flex">
                <div className="w-full h-full">
                  <Image
                    src="/home-get-in-touch.webp"
                    alt="Consultation"
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
            <div className="w-full">
              <RequestConsultationForm />
            </div>
          </div>
        </SectionLayout>
      </section>

      <section className="section-with-badge px-4 lg:px-0 bg-secondary">
        <SectionLayout>
          <div className="flex flex-col items-start items-center gap-4 bg-[#FAF3EE] rounded-2xl p-6 lg:py-12 relative xl:max-w-[1600px] mx-auto">
            <div className="logo-badge">
              <Image src="/badge.png" alt="Badge" width={220} height={220} className="absolute w-32 h-32 -top-8 -right-2 lg:w-[220px] lg:h-[220px] md:-top-12 lg:-right-12" />
            </div>
            <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full text-[#C29970]">FOR DEVELOPERS</span>
            <h2 className="text-4xl font-bold w-[100%] lg:w-[50%] text-left lg:text-center mx-auto text-[#101518]">List Your Residence & Get Ranked Among the Best</h2>
            <p className="text-md lg:text-md w-full lg:w-[65%] text-left lg:text-center mx-auto text-[#1A1E21]">
              Is your luxury residence one of the finest in the world? Elevate its prestige by securing a spot on Best Branded Residences. Our expert-driven rankings and reviews showcase top-tier residences to discerning buyers, investors, and luxury connoisseurs.
            </p>
            <div className="w-full lg:w-fit m-auto items-center justify-center">
              <ListResidenceButton />
            </div>
          </div>
        </SectionLayout>
      </section>
    </>
  );
}

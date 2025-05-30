import { Button } from "@/components/ui/button";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import SectionLayout from "@/components/web/SectionLayout";
import Image from "next/image";
import Link from "next/link";

import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'About Us',
    description: 'We are a team of experts who are passionate about helping people find the best branded residences. We use a combination of data and expert insights to assess the quality of each residence.',
    slug: 'about-us',
    keywords: ['about us', 'luxury residences', 'company info']
  }
})

export default function AboutUsPage() {
  return (
    <div>
      {/* FIRST SECTION */}
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-8 lg:mb-0">
        <div className="flex flex-col gap-6 w-full xl:max-w-[1600px] mx-auto rounded-xl bg-black/50 p-4 lg:p-8 py-12 lg:py-32 relative overflow-hidden">
          <Image
            src="/about-us-hero.png"
            alt="about-us"
            fill
            className="w-full h-full object-cover"
          />
          <div className="flex flex-col align-center justify-center gap-[20px] z-10">
            <h1 className="text-4xl font-bold text-left lg:text-center w-full lg:w-[48%] mx-auto">
              Explore Exciting Career Opportunities and Join Our Team Today
            </h1>
            <p className="font-normal lg:text-lg w-full text-left lg:text-center mx-auto text-white">
              We blend AI technology with human insight to evaluate the world’s
              most exceptional branded residences.
            </p>
            <Link
              href="/rankings"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit lg:m-auto"
            >
              Explore Our Rankings
            </Link>
          </div>
        </div>
      </div>

      {/* SECOND SECTION */}
      <SectionLayout className="ps-4 pe-4 lg:ps-0 lg:pe-0 m-auto mb-8 lg:mb-0">
        <div className="flex flex-col gap-4 bg-secondary rounded-xl p-4 lg:p-12 w-full xl:max-w-[1600px] mx-auto h-[485px] sm:h-[350px] md:h-[400px] pt-8 lg:pt-12">
          <p className="text-md text-left lg:text-center text-primary z-10">
            OUR PURPOSE
          </p>
          <h1 className="text-4xl font-bold w-[100%] lg:w-[60%] text-left lg:text-center mx-auto">
            Why We Exist?
          </h1>
          <p className="text-md lg:text-lg w-full lg:w-[80%] text-left lg:text-center mx-auto text-white/70">
            Luxury real estate is more than just square footage and high-rises.
            It’s about lifestyle, identity, and longterm value. We built this
            platform to cut through marketing noise—delivering clarity and
            confidence to those who expect more.
          </p>
        </div>
        <div className="flex w-full xl:max-w-[1600px] mx-auto flex-col -mt-[200px] sm:-mt-[100px] md:-mt-[150px]">
          <Image
            src="/why-we-exist.png"
            alt="why-we-exist"
            width={1500}
            height={380}
            className="w-[90%] max-h-[380px] place-self-center"
          />
          <Image
            src="/bbr-logo-circle.png"
            alt="bbr-logo"
            width={130}
            height={130}
            className="place-self-center w-[70px] h-[70px] lg:w-[130px] lg:h-[130px] -translate-y-1/2"
          />
        </div>
      </SectionLayout>

      {/* THIRD SECTION */}
      <div className="w-full xl:max-w-[1600px] mx-auto">
        <SectionLayout className="flex flex-col lg:flex-row gap-4 mb-8 lg:mb-20 ps-4 pe-4 lg:ps-0 lg:pe-0" >
          <div className="min-w-full lg:min-w-[45%] min-h-[600px] lg:min-h-[650px] relative rounded-xl overflow-hidden">
            <Image
              src="/bbr-founder.png"
              alt="why-we-exist"
              fill
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col gap-8 justify-between">
            <span className="text-md !font-bold lg:text-lg text-left text-primary w-full">
              OUR STORY
            </span>
            <h1 className="text-4xl w-[100%] text-left mx-auto">
              A Founder's Vision
            </h1>
            <p className="text-md lg:text-xl w-full text-justify text-white">
              I created this platform to bring transparency and quality into the
              branded residence market. With decades of experience in review
              systems and a passion for architecture and real estate, I saw an
              opportunity to raise the bar.I created this platform to bring
              transparency and quality into the branded residence market.
            </p>
            <div className="flex flex-col bg-[#F9E6D2] rounded-xl px-[32px] py-[28px] gap-2">
              <svg
                width="25"
                height="25"
                viewBox="0 0 38 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 32L9.55419 0H17.6687L11.91 32H0ZM19.8937 32L29.4478 0H37.5624L31.8037 32H19.8937Z"
                  fill="#B3804C"
                />
              </svg>

              <p className="text-justify text-md lg:text-xl text-[#0F172A] lg:text-3xl">
                I created this platform to bring transparency and quality into the
                branded residence market. With decades of experience in review
                systems and a passion for architecture and real estate, I saw an
                opportunity to raise the bar.I created this platform to bring
                transparency and quality into the branded residence market.
              </p>
              <p className="text-[#0F172A] text-xl">Jeev Trika, Founder</p>
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* FOURTH SECTION */}
      <div className="flex flex-col bg-secondary mb-20 pb-20">
        <SectionLayout>
          <div className="flex flex-col gap-4">
            <span className="text-bold lg:text-lg text-left lg:text-center text-primary w-full">
              OUR APPROACH
            </span>
            <h2 className="text-4xl font-bold w-[100%] text-left lg:text-center mx-auto mb-5">
              How We Evaluate Residences?
            </h2>
            <p className="text-md lg:text-lg w-full lg:w-[60%] text-left lg:text-center mx-auto text-white/70">
              I created this platform to bring transparency and quality into the
              branded residence market. With decades of experience in review systems
              and a passion for...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full items-center">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 w-full h-fit">
              <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border h-fit">
                <div className="flex flex-row gap-4 items-center mb-4">
                  <div className="relative">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.6668 22.6667L20.3572 20.357M20.3572 20.357C20.9604 19.7538 21.3335 18.9205 21.3335 18C21.3335 16.1591 19.8411 14.6667 18.0002 14.6667C16.1592 14.6667 14.6668 16.1591 14.6668 18C14.6668 19.841 16.1592 21.3333 18.0002 21.3333C18.9206 21.3333 19.754 20.9602 20.3572 20.357ZM16.8002 9.33334H20.5335C21.2802 9.33334 21.6536 9.33334 21.9388 9.18802C22.1897 9.06019 22.3937 8.85621 22.5215 8.60533C22.6668 8.32012 22.6668 7.94675 22.6668 7.20001V3.46668C22.6668 2.71994 22.6668 2.34657 22.5215 2.06136C22.3937 1.81047 22.1897 1.6065 21.9388 1.47867C21.6536 1.33334 21.2802 1.33334 20.5335 1.33334H16.8002C16.0534 1.33334 15.6801 1.33334 15.3948 1.47867C15.144 1.6065 14.94 1.81047 14.8122 2.06136C14.6668 2.34657 14.6668 2.71994 14.6668 3.46668V7.20001C14.6668 7.94675 14.6668 8.32012 14.8122 8.60533C14.94 8.85621 15.144 9.06019 15.3948 9.18802C15.6801 9.33334 16.0534 9.33334 16.8002 9.33334ZM3.46683 9.33334H7.20016C7.9469 9.33334 8.32027 9.33334 8.60548 9.18802C8.85637 9.06019 9.06034 8.85621 9.18817 8.60533C9.3335 8.32012 9.3335 7.94675 9.3335 7.20001V3.46668C9.3335 2.71994 9.3335 2.34657 9.18817 2.06136C9.06034 1.81047 8.85637 1.6065 8.60548 1.47867C8.32027 1.33334 7.9469 1.33334 7.20016 1.33334H3.46683C2.72009 1.33334 2.34672 1.33334 2.06151 1.47867C1.81063 1.6065 1.60665 1.81047 1.47882 2.06136C1.3335 2.34657 1.3335 2.71994 1.3335 3.46668V7.20001C1.3335 7.94675 1.3335 8.32012 1.47882 8.60533C1.60665 8.85621 1.81063 9.06019 2.06151 9.18802C2.34672 9.33334 2.72009 9.33334 3.46683 9.33334ZM3.46683 22.6667H7.20016C7.9469 22.6667 8.32027 22.6667 8.60548 22.5214C8.85637 22.3935 9.06034 22.1896 9.18817 21.9387C9.3335 21.6535 9.3335 21.2801 9.3335 20.5333V16.8C9.3335 16.0533 9.3335 15.6799 9.18817 15.3947C9.06034 15.1438 8.85637 14.9398 8.60548 14.812C8.32027 14.6667 7.9469 14.6667 7.20016 14.6667H3.46683C2.72009 14.6667 2.34672 14.6667 2.06151 14.812C1.81063 14.9398 1.60665 15.1438 1.47882 15.3947C1.3335 15.6799 1.3335 16.0533 1.3335 16.8V20.5333C1.3335 21.2801 1.3335 21.6535 1.47882 21.9387C1.60665 22.1896 1.81063 22.3935 2.06151 22.5214C2.34672 22.6667 2.72009 22.6667 3.46683 22.6667Z"
                        stroke="#FAF3EE"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold">AI-Powered Scoring:</h1>
                </div>
                <p>Dynamic, data-driven evaluation across multiple dimensions</p>
              </div>

              <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border h-fit">
                <div className="flex flex-row gap-4 items-center mb-4">
                  <div className="relative">
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.33333 8.00001V5.60001C2.33333 4.10654 2.33333 3.3598 2.62398 2.78937C2.87964 2.2876 3.28759 1.87966 3.78936 1.62399C4.35979 1.33334 5.10653 1.33334 6.6 1.33334H19.4C20.8935 1.33334 21.6402 1.33334 22.2106 1.62399C22.7124 1.87966 23.1204 2.2876 23.376 2.78937C23.6667 3.3598 23.6667 4.10654 23.6667 5.60001V18.4C23.6667 19.8935 23.6667 20.6402 23.376 21.2107C23.1204 21.7124 22.7124 22.1204 22.2106 22.376C21.6402 22.6667 20.8935 22.6667 19.4 22.6667H11M11.6667 17.3333H19.6667M7.66667 10.6667L11.6667 8.00001V12L19.6667 5.33334M19.6667 5.33334H15.6667M19.6667 5.33334V9.33334M6.33333 15.3334C5.66667 15.168 4.58011 15.1619 3.66666 15.168C3.36122 15.1701 3.54588 15.1571 3.13334 15.168C2.05677 15.2016 1.0022 15.649 1 16.9167C0.997666 18.2672 2.33333 18.6667 3.66666 18.6667C5 18.6667 6.33333 18.975 6.33333 20.4167C6.33333 21.5002 5.25667 21.9749 3.9148 22.1321C2.84813 22.1321 2.33333 22.1667 1 22M3.66667 22.6667V24M3.66667 13.3333V14.6667"
                        stroke="#FAF3EE"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold">Tailored Categories</h1>
                </div>
                <p>
                  Ranking that adjust byregion, lifestyle, property type, and
                  brand
                </p>
              </div>
            </div>

            <div className="border w-full rounded-xl relative h-[400px] p-4">
              <div className="rounded-xl overflow-hidden h-full">
                <Image 
                  src="/about-us-evaluate.webp"
                  alt="evaluate"
                  width={1000}
                  height={700}
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
              <Image
                src="/bbr-score.png"
                alt="bb-score"
                width={450}
                height={240}
                className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%]"
              />
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 w-full h-fit">
              <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border h-fit">
                <div className="flex flex-row gap-4 items-center mb-4">
                  <div className="relative">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.6668 22.6667L20.3572 20.357M20.3572 20.357C20.9604 19.7538 21.3335 18.9205 21.3335 18C21.3335 16.1591 19.8411 14.6667 18.0002 14.6667C16.1592 14.6667 14.6668 16.1591 14.6668 18C14.6668 19.841 16.1592 21.3333 18.0002 21.3333C18.9206 21.3333 19.754 20.9602 20.3572 20.357ZM16.8002 9.33334H20.5335C21.2802 9.33334 21.6536 9.33334 21.9388 9.18802C22.1897 9.06019 22.3937 8.85621 22.5215 8.60533C22.6668 8.32012 22.6668 7.94675 22.6668 7.20001V3.46668C22.6668 2.71994 22.6668 2.34657 22.5215 2.06136C22.3937 1.81047 22.1897 1.6065 21.9388 1.47867C21.6536 1.33334 21.2802 1.33334 20.5335 1.33334H16.8002C16.0534 1.33334 15.6801 1.33334 15.3948 1.47867C15.144 1.6065 14.94 1.81047 14.8122 2.06136C14.6668 2.34657 14.6668 2.71994 14.6668 3.46668V7.20001C14.6668 7.94675 14.6668 8.32012 14.8122 8.60533C14.94 8.85621 15.144 9.06019 15.3948 9.18802C15.6801 9.33334 16.0534 9.33334 16.8002 9.33334ZM3.46683 9.33334H7.20016C7.9469 9.33334 8.32027 9.33334 8.60548 9.18802C8.85637 9.06019 9.06034 8.85621 9.18817 8.60533C9.3335 8.32012 9.3335 7.94675 9.3335 7.20001V3.46668C9.3335 2.71994 9.3335 2.34657 9.18817 2.06136C9.06034 1.81047 8.85637 1.6065 8.60548 1.47867C8.32027 1.33334 7.9469 1.33334 7.20016 1.33334H3.46683C2.72009 1.33334 2.34672 1.33334 2.06151 1.47867C1.81063 1.6065 1.60665 1.81047 1.47882 2.06136C1.3335 2.34657 1.3335 2.71994 1.3335 3.46668V7.20001C1.3335 7.94675 1.3335 8.32012 1.47882 8.60533C1.60665 8.85621 1.81063 9.06019 2.06151 9.18802C2.34672 9.33334 2.72009 9.33334 3.46683 9.33334ZM3.46683 22.6667H7.20016C7.9469 22.6667 8.32027 22.6667 8.60548 22.5214C8.85637 22.3935 9.06034 22.1896 9.18817 21.9387C9.3335 21.6535 9.3335 21.2801 9.3335 20.5333V16.8C9.3335 16.0533 9.3335 15.6799 9.18817 15.3947C9.06034 15.1438 8.85637 14.9398 8.60548 14.812C8.32027 14.6667 7.9469 14.6667 7.20016 14.6667H3.46683C2.72009 14.6667 2.34672 14.6667 2.06151 14.812C1.81063 14.9398 1.60665 15.1438 1.47882 15.3947C1.3335 15.6799 1.3335 16.0533 1.3335 16.8V20.5333C1.3335 21.2801 1.3335 21.6535 1.47882 21.9387C1.60665 22.1896 1.81063 22.3935 2.06151 22.5214C2.34672 22.6667 2.72009 22.6667 3.46683 22.6667Z"
                        stroke="#FAF3EE"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold">Expert Oversight</h1>
                </div>
                <p>Human refinement and context behind the numbers</p>
              </div>

              <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border h-fit">
                <div className="flex flex-row gap-4 items-center mb-4">
                  <div className="relative">
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.33333 8.00001V5.60001C2.33333 4.10654 2.33333 3.3598 2.62398 2.78937C2.87964 2.2876 3.28759 1.87966 3.78936 1.62399C4.35979 1.33334 5.10653 1.33334 6.6 1.33334H19.4C20.8935 1.33334 21.6402 1.33334 22.2106 1.62399C22.7124 1.87966 23.1204 2.2876 23.376 2.78937C23.6667 3.3598 23.6667 4.10654 23.6667 5.60001V18.4C23.6667 19.8935 23.6667 20.6402 23.376 21.2107C23.1204 21.7124 22.7124 22.1204 22.2106 22.376C21.6402 22.6667 20.8935 22.6667 19.4 22.6667H11M11.6667 17.3333H19.6667M7.66667 10.6667L11.6667 8.00001V12L19.6667 5.33334M19.6667 5.33334H15.6667M19.6667 5.33334V9.33334M6.33333 15.3334C5.66667 15.168 4.58011 15.1619 3.66666 15.168C3.36122 15.1701 3.54588 15.1571 3.13334 15.168C2.05677 15.2016 1.0022 15.649 1 16.9167C0.997666 18.2672 2.33333 18.6667 3.66666 18.6667C5 18.6667 6.33333 18.975 6.33333 20.4167C6.33333 21.5002 5.25667 21.9749 3.9148 22.1321C2.84813 22.1321 2.33333 22.1667 1 22M3.66667 22.6667V24M3.66667 13.3333V14.6667"
                        stroke="#FAF3EE"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold">Global Focus</h1>
                </div>
                <p>From major metropolises to exclusive coastal retreats</p>
              </div>
            </div>
          </div>
        </SectionLayout>
      </div>

      {/* FIFTH SECTION */}
      <div className="flex flex-col gap-4 bg-secondary rounded-xl p-4 lg:p-12 w-full xl:max-w-[1600px] mx-auto mb-20">
        <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full">
          NEW SOLUTION
        </span>
        <h2 className="text-4xl font-bold w-[100%] lg:w-[50%] text-left lg:text-center mx-auto">
          The Smartest Way to Buy, Invest & Discover Branded Residences
        </h2>
        <p className="text-md lg:text-lg w-full lg:w-[50%] text-left lg:text-center mx-auto text-white">
          From iconic penthouses to high-ROI investments, explore properties
          ranked by trust, quality, and long-term value.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 w-full">
          <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
            <div className="flex flex-row gap-4 items-center mb-4">
              <div className="relative">
                <span className="absolute -top-4 -left-4 rounded-full bg-white/10 w-12 h-12"></span>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 21L16.0178 24.0178C16.7053 24.7053 17.0491 25.0491 17.4396 25.1643C17.7827 25.2656 18.1499 25.2489 18.4824 25.117C18.8609 24.9669 19.1722 24.5934 19.7946 23.8465L28 14M28.6575 5.5171C30.1351 5.55927 31.6001 6.14423 32.7279 7.27201C33.8557 8.39978 34.4407 9.86479 34.4828 11.3424C34.5246 12.8046 34.5454 13.5357 34.5883 13.7059C34.6802 14.0702 34.5735 13.8125 34.7661 14.135C34.8561 14.2857 35.3584 14.8175 36.3627 15.8809C37.3777 16.9556 38 18.4051 38 20C38 21.5949 37.3777 23.0444 36.3627 24.1191C35.3584 25.1825 34.8561 25.7143 34.7661 25.865C34.5735 26.1875 34.6802 25.9298 34.5883 26.2941C34.5454 26.4643 34.5246 27.1954 34.4828 28.6576C34.4407 30.1352 33.8557 31.6002 32.7279 32.728C31.6001 33.8558 30.1351 34.4407 28.6575 34.4829C27.1953 34.5246 26.4642 34.5455 26.294 34.5884C25.9298 34.6803 26.1874 34.5735 25.8649 34.7661C25.7142 34.8561 25.1825 35.3584 24.1191 36.3627C23.0444 37.3777 21.5949 38 20 38C18.4051 38 16.9556 37.3777 15.8809 36.3628C14.8175 35.3583 14.2857 34.8561 14.1351 34.7661C13.8125 34.5735 14.0702 34.6802 13.7059 34.5884C13.5358 34.5455 12.8045 34.5246 11.3424 34.4829C9.86476 34.4407 8.39972 33.8558 7.27194 32.728C6.14415 31.6002 5.55918 30.1351 5.51703 28.6575C5.47533 27.1953 5.45447 26.4642 5.41156 26.294C5.3197 25.9298 5.42643 26.1874 5.23382 25.8649C5.14384 25.7142 4.64164 25.1825 3.63723 24.119C2.62226 23.0444 2 21.5949 2 20C2 18.4051 2.62226 16.9556 3.63723 15.881C4.64164 14.8175 5.14384 14.2858 5.23382 14.1351C5.42643 13.8126 5.3197 14.0702 5.41156 13.706C5.45447 13.5358 5.47533 12.8047 5.51703 11.3425C5.55918 9.86485 6.14415 8.3998 7.27194 7.27201C8.39972 6.14423 9.86476 5.55926 11.3424 5.5171C12.8046 5.47539 13.5358 5.45453 13.7059 5.41162C14.0702 5.31976 13.8125 5.4265 14.1351 5.23388C14.2857 5.14389 14.8175 4.64164 15.8809 3.63725C16.9556 2.62226 18.4051 2 20 2C21.5949 2 23.0444 2.62227 24.1191 3.63728C25.1825 4.64168 25.7142 5.14388 25.8649 5.23386C26.1874 5.42648 25.9298 5.31975 26.294 5.41161C26.4642 5.45452 27.1953 5.47538 28.6575 5.5171Z"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">
                Verified Global Luxury Residences
              </h3>
            </div>
            <p>
              Every property is carefully vetted for quality, prestige, and
              long-term value.
            </p>
          </div>

          <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
            <div className="flex flex-row gap-4 items-center mb-4">
              <div className="relative">
                <span className="absolute -top-4 -left-4 rounded-full bg-white/10 w-12 h-12"></span>
                <svg
                  width="44"
                  height="31"
                  viewBox="0 0 44 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M42 7.00001H38M38 7.00001H36C32 3.00358 26 -1.0004 22 3.00001M38 7.00001V23M22 3.00001L15.9991 9.00328C15.8404 9.16206 15.761 9.24144 15.6972 9.31171C14.31 10.8379 14.3106 13.1686 15.6985 14.6941C15.7624 14.7643 15.842 14.8438 16.0006 15.0024C16.1593 15.161 16.2387 15.2403 16.309 15.3042C17.8349 16.6908 20.1647 16.6904 21.6902 15.3033C21.7604 15.2395 21.8398 15.1601 21.9984 15.0014L23.9992 13.0007M22 3.00001C18 -1.0004 12 3.00372 8 7.00015H6M2 7.00015H6M6 7.00015V23M38 23V29H42M38 23H32.3431M28 17L31 20C31.1592 20.1592 31.239 20.239 31.3031 20.3095C32.6898 21.8351 32.6898 24.1649 31.3031 25.6905C31.239 25.761 31.1592 25.8408 31 26C30.8408 26.1592 30.761 26.239 30.6905 26.3031C29.1649 27.6899 26.8351 27.6899 25.3095 26.3031C25.239 26.239 25.1592 26.1592 25 26L24 25C22.9095 26.0905 22.3643 26.6358 21.7761 26.9272C20.657 27.4818 19.343 27.4818 18.2239 26.9272C17.6358 26.6358 17.0905 26.0905 16 25C14.6217 26.8378 11.7913 26.5825 10.7639 24.5279L10 23H6M6 23V29H2"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">
                Exclusive Developer Partnerships
              </h3>
            </div>
            <p>
              Get direct access to top-tier branded residences from leading
              global developers.
            </p>
          </div>

          <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
            <div className="flex flex-row gap-4 items-center mb-4">
              <div className="relative">
                <span className="absolute -top-4 -left-4 rounded-full bg-white/10 w-12 h-12"></span>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M38 38H11.6C8.23968 38 6.55953 38 5.27606 37.346C4.14708 36.7708 3.2292 35.8529 2.65396 34.7239C2 33.4405 2 31.7603 2 28.4V2M8 26L16 18L24 26L36 14M36 14V22M36 14H28"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">
                Data-Driven Investment Insights
              </h3>
            </div>
            <p>
              Access ROI projections, rental yield reports, and market trends to
              make smarter buying decisions.
            </p>
          </div>

          <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
            <div className="flex flex-row gap-4 items-center mb-4">
              <div className="relative">
                <span className="absolute -top-4 -left-4 rounded-full bg-white/10 w-12 h-12"></span>
                <svg
                  width="39"
                  height="41"
                  viewBox="0 0 39 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.00019 12V20M16.0002 2V10M32.0002 30V38M2.00019 16H10.0002M12.0002 6H20.0002M28.0002 34H36.0002M24.0002 12L29.657 17.6569M35.0334 5.49223L36.1648 6.6236C36.9568 7.41564 37.3529 7.81166 37.5012 8.26831C37.6318 8.67 37.6318 9.10269 37.5012 9.50438C37.3529 9.96104 36.9568 10.3571 36.1648 11.1491L9.05113 38.2628C8.2591 39.0548 7.86308 39.4508 7.40642 39.5992C7.00474 39.7297 6.57204 39.7297 6.17035 39.5992C5.7137 39.4508 5.31768 39.0548 4.52565 38.2628L3.39428 37.1314C2.60224 36.3394 2.20623 35.9433 2.05785 35.4867C1.92733 35.085 1.92733 34.6523 2.05785 34.2506C2.20623 33.794 2.60224 33.3979 3.39428 32.6059L30.508 5.49224C31.3 4.7002 31.696 4.30418 32.1527 4.15581C32.5543 4.02529 32.987 4.02529 33.3887 4.15581C33.8454 4.30418 34.2414 4.7002 35.0334 5.49223Z"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">
                AI-Powered Property Matchmaking
              </h3>
            </div>
            <p>
              Our SmartMatch AI recommends the best properties based on your
              goals, lifestyle, and budget.
            </p>
          </div>

          <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
            <div className="flex flex-row gap-4 items-center mb-4">
              <div className="relative">
                <span className="absolute -top-4 -left-4 rounded-full bg-white/10 w-12 h-12"></span>
                <svg
                  width="36"
                  height="40"
                  viewBox="0 0 36 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 38H2C2 30.9471 7.21541 25.1122 14 24.1418M26.9952 28.4239C25.5957 26.8656 23.2618 26.4464 21.5083 27.8733C19.7547 29.3003 19.5079 31.686 20.8849 33.3736C21.6624 34.3264 23.5095 35.9967 24.9708 37.2706C25.6638 37.8748 26.0103 38.1769 26.4294 38.3005C26.7867 38.4059 27.2037 38.4059 27.561 38.3005C27.9801 38.1769 28.3266 37.8748 29.0196 37.2706C30.4809 35.9967 32.328 34.3264 33.1055 33.3736C34.4825 31.686 34.2658 29.2852 32.4821 27.8733C30.6984 26.4614 28.3948 26.8656 26.9952 28.4239ZM24 10C24 14.4183 20.4183 18 16 18C11.5817 18 8 14.4183 8 10C8 5.58172 11.5817 2 16 2C20.4183 2 24 5.58172 24 10Z"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">
                First People oriented real-estate platform
              </h3>
            </div>
            <p>
              Real estate should be about people, not just properties. We
              connect buyers, investors, and developers with curated listings -
              ensuring a seamless, personalized experience.
            </p>
          </div>

          <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
            <div className="flex flex-row gap-4 items-center mb-4">
              <div className="relative">
                <span className="absolute -top-4 -left-4 rounded-full bg-white/10 w-12 h-12"></span>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M38 38H11.6C8.23968 38 6.55953 38 5.27606 37.346C4.14708 36.7708 3.2292 35.8529 2.65396 34.7239C2 33.4405 2 31.7603 2 28.4V2M8 26L16 18L24 26L36 14M36 14V22M36 14H28"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">
                Industry-Leading Rankings & Ratings
              </h3>
            </div>
            <p>
              Discover the Top 10 luxury homes, best high-rise investments, and
              top waterfront properties.
            </p>
          </div>
        </div>
      </div>

      {/* SIXTH SECTION */}
      <SectionLayout className="relative mb-20 rounded-xl overflow-hidden h-[400px]">
        <div className="absolute inset-0 w-full xl:max-w-[1600px] mx-auto rounded-xl overflow-hidden">
          <Image
            src="/explore-banner.webp"
            alt="about-us"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative flex flex-col justify-center items-center gap-[20px] z-10 h-full p-6">
          <h2 className="text-4xl font-bold w-[100%] text-left lg:text-center mx-auto">
            Explore. Compare. Decide with Confidence.
          </h2>
          <p className="text-md lg:text-lg w-full lg:w-[80%] text-left lg:text-center mx-auto text-white">
            Let our platform guide your next step in branded living.
          </p>
          <div className="flex gap-[8px] place-self-start lg:place-self-center">
            <Link href="/ranking" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit">
              View Rankings
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-transparent text-primary-foreground shadow-xs hover:bg-white/5 h-9 px-4 py-2 has-[>svg]:px-3 w-fit border border-white/70" >
              Contact Our Team
            </Link>
          </div>
        </div>
      </SectionLayout>

      {/* SEVENTH SECTION */}
      <div className="flex flex-col bg-secondary mb-20">
       <SectionLayout>
        <div className="w-full xl:max-w-[1600px] mx-auto">
          <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full">
            WHO WE SERVE
          </span>
          <h2 className="text-4xl font-bold w-[100%] text-left lg:text-center mx-auto">
            Built for Those Who Lead, Live, and Invest
          </h2>
          <p className="text-md lg:text-lg w-full lg:w-[50%] text-left lg:text-center mx-auto text-white">
            From iconic penthouses to high-ROI investments, explore properties
            ranked by trust, quality, and long-term value.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full mt-12 mb-8">
            <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
              <div className="flex flex-row gap-4 items-center mb-4">
                <div className="relative">
                  <svg
                    width="24"
                    height="26"
                    viewBox="0 0 24 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.6668 22.7143L17.0668 25L22.6668 19.6667M18.0002 16.2023C17.6071 15.9753 17.1714 15.813 16.7072 15.7296C16.6066 15.7116 16.5 15.6987 16.3791 15.6895C16.0788 15.6667 15.9286 15.6553 15.7283 15.6702C15.52 15.6858 15.4037 15.7063 15.2027 15.763C15.0094 15.8175 14.661 15.9753 13.9644 16.2909C12.9589 16.7464 11.8425 17 10.6668 17C9.49117 17 8.37473 16.7464 7.36925 16.2909C6.67254 15.9753 6.32419 15.8175 6.13079 15.763C5.92977 15.7062 5.81326 15.6857 5.60497 15.6702C5.40458 15.6552 5.25456 15.6667 4.9545 15.6895C4.83176 15.6989 4.72349 15.7121 4.62094 15.7306C2.97939 16.0278 1.69465 17.3126 1.39748 18.9541C1.3335 19.3075 1.3335 19.7313 1.3335 20.5788V22.8667C1.3335 23.6134 1.3335 23.9868 1.47882 24.272C1.60665 24.5229 1.81063 24.7268 2.06151 24.8547C2.34672 25 2.72009 25 3.46683 25H10.0002M16.0002 6.33333C16.0002 9.27885 13.6123 11.6667 10.6668 11.6667C7.72131 11.6667 5.3335 9.27885 5.3335 6.33333C5.3335 3.38781 7.72131 1 10.6668 1C13.6123 1 16.0002 3.38781 16.0002 6.33333Z"
                      stroke="#FAF3EE"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-xl !font-medium">Buyers</p>
              </div>
              <p>Discover properties that meet your standards</p>
            </div>

            <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
              <div className="flex flex-row gap-4 items-center mb-4">
                <div className="relative">
                  <svg
                    width="27"
                    height="26"
                    viewBox="0 0 27 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 6.33333H6.33333M5 10.3333H6.33333M11.6667 10.3333H13M11.6667 14.3333H13M5 14.3333H6.33333M11.6667 6.33333H13M6.33333 25V21C6.33333 19.5272 7.52724 18.3333 9 18.3333C10.4728 18.3333 11.6667 19.5272 11.6667 21V25H6.33333ZM6.33333 25H1V3.13333C1 2.3866 1 2.01323 1.14532 1.72801C1.27316 1.47713 1.47713 1.27316 1.72801 1.14532C2.01323 1 2.3866 1 3.13333 1H14.8667C15.6134 1 15.9868 1 16.272 1.14532C16.5229 1.27316 16.7268 1.47713 16.8547 1.72801C17 2.01323 17 2.3866 17 3.13333V9M23.2667 15C23.2667 16.1046 22.3712 17 21.2667 17C20.1621 17 19.2667 16.1046 19.2667 15C19.2667 13.8954 20.1621 13 21.2667 13C22.3712 13 23.2667 13.8954 23.2667 15ZM25.6667 25V24.3333C25.6667 22.4924 24.1743 21 22.3333 21H20.3333C18.4924 21 17 22.4924 17 24.3333V25H25.6667Z"
                      stroke="#FAF3EE"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-xl font-medium">Developers & Brands</p>
              </div>
              <p>Elevate your visibility in a trusted environment</p>
            </div>

            <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
              <div className="flex flex-row gap-4 items-center mb-4">
                <div className="relative">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.6668 22.6667L20.3572 20.357M20.3572 20.357C20.9604 19.7538 21.3335 18.9205 21.3335 18C21.3335 16.1591 19.8411 14.6667 18.0002 14.6667C16.1592 14.6667 14.6668 16.1591 14.6668 18C14.6668 19.841 16.1592 21.3333 18.0002 21.3333C18.9206 21.3333 19.754 20.9602 20.3572 20.357ZM16.8002 9.33334H20.5335C21.2802 9.33334 21.6536 9.33334 21.9388 9.18802C22.1897 9.06019 22.3937 8.85621 22.5215 8.60533C22.6668 8.32012 22.6668 7.94675 22.6668 7.20001V3.46668C22.6668 2.71994 22.6668 2.34657 22.5215 2.06136C22.3937 1.81047 22.1897 1.6065 21.9388 1.47867C21.6536 1.33334 21.2802 1.33334 20.5335 1.33334H16.8002C16.0534 1.33334 15.6801 1.33334 15.3948 1.47867C15.144 1.6065 14.94 1.81047 14.8122 2.06136C14.6668 2.34657 14.6668 2.71994 14.6668 3.46668V7.20001C14.6668 7.94675 14.6668 8.32012 14.8122 8.60533C14.94 8.85621 15.144 9.06019 15.3948 9.18802C15.6801 9.33334 16.0534 9.33334 16.8002 9.33334ZM3.46683 9.33334H7.20016C7.9469 9.33334 8.32027 9.33334 8.60548 9.18802C8.85637 9.06019 9.06034 8.85621 9.18817 8.60533C9.3335 8.32012 9.3335 7.94675 9.3335 7.20001V3.46668C9.3335 2.71994 9.3335 2.34657 9.18817 2.06136C9.06034 1.81047 8.85637 1.6065 8.60548 1.47867C8.32027 1.33334 7.9469 1.33334 7.20016 1.33334H3.46683C2.72009 1.33334 2.34672 1.33334 2.06151 1.47867C1.81063 1.6065 1.60665 1.81047 1.47882 2.06136C1.3335 2.34657 1.3335 2.71994 1.3335 3.46668V7.20001C1.3335 7.94675 1.3335 8.32012 1.47882 8.60533C1.60665 8.85621 1.81063 9.06019 2.06151 9.18802C2.34672 9.33334 2.72009 9.33334 3.46683 9.33334ZM3.46683 22.6667H7.20016C7.9469 22.6667 8.32027 22.6667 8.60548 22.5214C8.85637 22.3935 9.06034 22.1896 9.18817 21.9387C9.3335 21.6535 9.3335 21.2801 9.3335 20.5333V16.8C9.3335 16.0533 9.3335 15.6799 9.18817 15.3947C9.06034 15.1438 8.85637 14.9398 8.60548 14.812C8.32027 14.6667 7.9469 14.6667 7.20016 14.6667H3.46683C2.72009 14.6667 2.34672 14.6667 2.06151 14.812C1.81063 14.9398 1.60665 15.1438 1.47882 15.3947C1.3335 15.6799 1.3335 16.0533 1.3335 16.8V20.5333C1.3335 21.2801 1.3335 21.6535 1.47882 21.9387C1.60665 22.1896 1.81063 22.3935 2.06151 22.5214C2.34672 22.6667 2.72009 22.6667 3.46683 22.6667Z"
                      stroke="#FAF3EE"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-xl font-medium">Explorers</p>
              </div>
              <p>See what’s rising and redefining modern luxury</p>
            </div>

            <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
              <div className="flex flex-row gap-4 items-center mb-4">
                <div className="relative">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.33333 8.00001V5.60001C2.33333 4.10654 2.33333 3.3598 2.62398 2.78937C2.87964 2.2876 3.28759 1.87966 3.78936 1.62399C4.35979 1.33334 5.10653 1.33334 6.6 1.33334H19.4C20.8935 1.33334 21.6402 1.33334 22.2106 1.62399C22.7124 1.87966 23.1204 2.2876 23.376 2.78937C23.6667 3.3598 23.6667 4.10654 23.6667 5.60001V18.4C23.6667 19.8935 23.6667 20.6402 23.376 21.2107C23.1204 21.7124 22.7124 22.1204 22.2106 22.376C21.6402 22.6667 20.8935 22.6667 19.4 22.6667H11M11.6667 17.3333H19.6667M7.66667 10.6667L11.6667 8.00001V12L19.6667 5.33334M19.6667 5.33334H15.6667M19.6667 5.33334V9.33334M6.33333 15.3334C5.66667 15.168 4.58011 15.1619 3.66666 15.168C3.36122 15.1701 3.54588 15.1571 3.13334 15.168C2.05677 15.2016 1.0022 15.649 1 16.9167C0.997666 18.2672 2.33333 18.6667 3.66666 18.6667C5 18.6667 6.33333 18.975 6.33333 20.4167C6.33333 21.5002 5.25667 21.9749 3.9148 22.1321C2.84813 22.1321 2.33333 22.1667 1 22M3.66667 22.6667V24M3.66667 13.3333V14.6667"
                      stroke="#FAF3EE"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-xl font-medium">Investors</p>
              </div>
              <p>Make informed decisions backed by data</p>
            </div>
          </div>
          <Image
            src="/about-us-women.png"
            alt="about-us"
            width={1500}
            height={400}
            className="w-full"
          />
        </div>
       </SectionLayout>
      </div>

      <NewsletterBlock />
    </div>
  );
}

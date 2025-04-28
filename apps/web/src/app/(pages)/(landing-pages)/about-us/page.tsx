import SectionLayout from "@/components/web/SectionLayout";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import Link from "next/link";
import Image from "next/image";

export default function AboutUsPage() {
    return (
        <>
            {/* Hero Section */}
            <div className="about-hero">
                <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 mb-3 lg:mb-12">
                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: 'url("/about.webp")' }}
                        />
                        <div className="absolute inset-0 bg-black/50" />
                        <div className="relative h-full flex flex-col items-center justify-center gap-6 px-4 lg:px-12 text-center">
                            <h1 className="text-4xl font-medium lg:w-[70%] text-white">
                                Shaping the Future of Luxury Real Estate Discovery
                            </h1>
                            <p className="text-white/80 lg:w-[50%]">We blend AI technology with human insight to evaluate the world's most exceptional branded residences.</p>
                            <Link
                                href=""
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-fit"
                            >
                                Explore Our Rankings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            

            <div className="bg-secondary">
                <div className="flex flex-col items-start lg:items-center rounded-b-xl max-w-[calc(100svw-1.5rem)] lg:max-w-[95svw] xl:max-w-[90svw] 2xl:max-w-[90svw] 3xl:max-w-[60svw] mx-auto px-4 lg:px-12 py-6 lg:py-12 gap-4 xl:gap-8 ">
                    <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full">Who We Serve</span>
                    <h2 className="text-4xl font-bold w-[100%] lg:w-[60%] text-left lg:text-center mx-auto">Built for Those Who Lead, Live, and Invest</h2>
                    <p className="text-md lg:text-lg w-full lg:w-[60%] text-left lg:text-center mx-auto text-white/70">From iconic penthouses to high-ROI investments, explore properties ranked by trust, quality, and long-term value.</p>
                    <div className="cards flex flex-col lg:flex-row gap-4 lg:gap-4 w-full lg:mt-6">
                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-col lg:flex-row gap-2 items-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M18.6668 25.7143L21.0668 28L26.6668 22.6667M22.0002 19.2023C21.6071 18.9753 21.1714 18.813 20.7072 18.7296C20.6066 18.7116 20.5 18.6987 20.3791 18.6895C20.0788 18.6667 19.9286 18.6553 19.7283 18.6702C19.52 18.6857 19.4037 18.7063 19.2027 18.763C19.0094 18.8175 18.661 18.9753 17.9644 19.2909C16.9589 19.7464 15.8425 20 14.6668 20C13.4912 20 12.3747 19.7464 11.3693 19.2909C10.6725 18.9753 10.3242 18.8175 10.1308 18.7629C9.92977 18.7062 9.81326 18.6857 9.60497 18.6702C9.40458 18.6552 9.25456 18.6667 8.9545 18.6895C8.83176 18.6989 8.72349 18.7121 8.62094 18.7306C6.97939 19.0278 5.69465 20.3126 5.39748 21.9541C5.3335 22.3075 5.3335 22.7313 5.3335 23.5788V25.8667C5.3335 26.6134 5.3335 26.9868 5.47882 27.272C5.60665 27.5229 5.81063 27.7268 6.06151 27.8547C6.34672 28 6.72009 28 7.46683 28H14.0002M20.0002 9.33332C20.0002 12.2788 17.6123 14.6667 14.6668 14.6667C11.7213 14.6667 9.3335 12.2788 9.3335 9.33332C9.3335 6.3878 11.7213 3.99998 14.6668 3.99998C17.6123 3.99998 20.0002 6.3878 20.0002 9.33332Z" stroke="#FAF3EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <h3 className="text-xl text-white font-medium transition-all text-sans">Buyers</h3>
                            </div>
                            <p className="text-md text-muted-foreground text-center lg:text-left">
                                Discover properties that meet your standards
                            </p>
                        </div>
                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-col lg:flex-row gap-2 items-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M8 9.33333H9.33333M8 13.3333H9.33333M14.6667 13.3333H16M14.6667 17.3333H16M8 17.3333H9.33333M14.6667 9.33333H16M9.33333 28V24C9.33333 22.5272 10.5272 21.3333 12 21.3333C13.4728 21.3333 14.6667 22.5272 14.6667 24V28H9.33333ZM9.33333 28H4V6.13333C4 5.3866 4 5.01323 4.14532 4.72801C4.27316 4.47713 4.47713 4.27316 4.72801 4.14532C5.01323 4 5.3866 4 6.13333 4H17.8667C18.6134 4 18.9868 4 19.272 4.14532C19.5229 4.27316 19.7268 4.47713 19.8547 4.72801C20 5.01323 20 5.3866 20 6.13333V12M26.2667 18C26.2667 19.1046 25.3712 20 24.2667 20C23.1621 20 22.2667 19.1046 22.2667 18C22.2667 16.8954 23.1621 16 24.2667 16C25.3712 16 26.2667 16.8954 26.2667 18ZM28.6667 28V27.3333C28.6667 25.4924 27.1743 24 25.3333 24H23.3333C21.4924 24 20 25.4924 20 27.3333V28H28.6667Z" stroke="#FAF3EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <h3 className="text-xl text-white font-medium transition-all text-sans">Developers & Brands</h3>
                            </div>
                            <p className="text-md text-muted-foreground text-center lg:text-left">
                                Elevate your visibility in a trusted environment
                            </p>
                        </div>
                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-col lg:flex-row gap-2 items-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M26.6668 26.6667L24.3572 24.357M24.3572 24.357C24.9604 23.7538 25.3335 22.9205 25.3335 22C25.3335 20.1591 23.8411 18.6667 22.0002 18.6667C20.1592 18.6667 18.6668 20.1591 18.6668 22C18.6668 23.841 20.1592 25.3333 22.0002 25.3333C22.9206 25.3333 23.754 24.9602 24.3572 24.357ZM20.8002 13.3333H24.5335C25.2802 13.3333 25.6536 13.3333 25.9388 13.188C26.1897 13.0602 26.3937 12.8562 26.5215 12.6053C26.6668 12.3201 26.6668 11.9467 26.6668 11.2V7.46668C26.6668 6.71994 26.6668 6.34657 26.5215 6.06136C26.3937 5.81047 26.1897 5.6065 25.9388 5.47867C25.6536 5.33334 25.2802 5.33334 24.5335 5.33334H20.8002C20.0534 5.33334 19.6801 5.33334 19.3948 5.47867C19.144 5.6065 18.94 5.81047 18.8122 6.06136C18.6668 6.34657 18.6668 6.71994 18.6668 7.46668V11.2C18.6668 11.9467 18.6668 12.3201 18.8122 12.6053C18.94 12.8562 19.144 13.0602 19.3948 13.188C19.6801 13.3333 20.0534 13.3333 20.8002 13.3333ZM7.46683 13.3333H11.2002C11.9469 13.3333 12.3203 13.3333 12.6055 13.188C12.8564 13.0602 13.0603 12.8562 13.1882 12.6053C13.3335 12.3201 13.3335 11.9467 13.3335 11.2V7.46668C13.3335 6.71994 13.3335 6.34657 13.1882 6.06136C13.0603 5.81047 12.8564 5.6065 12.6055 5.47867C12.3203 5.33334 11.9469 5.33334 11.2002 5.33334H7.46683C6.72009 5.33334 6.34672 5.33334 6.06151 5.47867C5.81063 5.6065 5.60665 5.81047 5.47882 6.06136C5.3335 6.34657 5.3335 6.71994 5.3335 7.46668V11.2C5.3335 11.9467 5.3335 12.3201 5.47882 12.6053C5.60665 12.8562 5.81063 13.0602 6.06151 13.188C6.34672 13.3333 6.72009 13.3333 7.46683 13.3333ZM7.46683 26.6667H11.2002C11.9469 26.6667 12.3203 26.6667 12.6055 26.5214C12.8564 26.3935 13.0603 26.1896 13.1882 25.9387C13.3335 25.6535 13.3335 25.2801 13.3335 24.5333V20.8C13.3335 20.0533 13.3335 19.6799 13.1882 19.3947C13.0603 19.1438 12.8564 18.9398 12.6055 18.812C12.3203 18.6667 11.9469 18.6667 11.2002 18.6667H7.46683C6.72009 18.6667 6.34672 18.6667 6.06151 18.812C5.81063 18.9398 5.60665 19.1438 5.47882 19.3947C5.3335 19.6799 5.3335 20.0533 5.3335 20.8V24.5333C5.3335 25.2801 5.3335 25.6535 5.47882 25.9387C5.60665 26.1896 5.81063 26.3935 6.06151 26.5214C6.34672 26.6667 6.72009 26.6667 7.46683 26.6667Z" stroke="#FAF3EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <h3 className="text-xl text-white font-medium transition-all text-sans">Explorers</h3>
                            </div>
                            <p className="text-md text-muted-foreground text-center lg:text-left">
                                See what’s rising and redefining modern luxury
                            </p>
                        </div>
                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-col lg:flex-row gap-2 items-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M5.33333 12V9.60001C5.33333 8.10654 5.33333 7.3598 5.62398 6.78937C5.87964 6.2876 6.28759 5.87966 6.78936 5.62399C7.35979 5.33334 8.10653 5.33334 9.6 5.33334H22.4C23.8935 5.33334 24.6402 5.33334 25.2106 5.62399C25.7124 5.87966 26.1204 6.2876 26.376 6.78937C26.6667 7.3598 26.6667 8.10654 26.6667 9.60001V22.4C26.6667 23.8935 26.6667 24.6402 26.376 25.2107C26.1204 25.7124 25.7124 26.1204 25.2106 26.376C24.6402 26.6667 23.8935 26.6667 22.4 26.6667H14M14.6667 21.3333H22.6667M10.6667 14.6667L14.6667 12V16L22.6667 9.33334M22.6667 9.33334H18.6667M22.6667 9.33334V13.3333M9.33333 19.3334C8.66667 19.168 7.58011 19.1619 6.66666 19.168C6.36122 19.1701 6.54588 19.1571 6.13334 19.168C5.05677 19.2016 4.0022 19.649 4 20.9167C3.99767 22.2672 5.33333 22.6667 6.66666 22.6667C8 22.6667 9.33333 22.975 9.33333 24.4167C9.33333 25.5002 8.25667 25.9749 6.9148 26.1321C5.84813 26.1321 5.33333 26.1667 4 26M6.66667 26.6667V28M6.66667 17.3333V18.6667" stroke="#FAF3EE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <h3 className="text-xl text-white font-medium transition-all text-sans">Investors</h3>
                            </div>
                            <p className="text-md text-muted-foreground text-center lg:text-left">
                                Make informed decisions backed by data
                            </p>
                        </div>
                    </div>
                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                        <Image src="/who-we-serve.webp" fill className="object-cover" alt="Who We Serve"/>
                    </div>
                </div>
            </div>




            <NewsletterBlock />
        </>
    );
}

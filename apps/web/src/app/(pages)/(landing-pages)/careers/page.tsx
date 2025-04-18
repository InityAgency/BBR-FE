
import React from "react";
import NewsletterBlock from "@/components/web/Newsletter/NewsletterBlock";
import SectionLayout from "@/components/web/SectionLayout";
import Image from "next/image";

import { Post } from "@/lib/wordpress/wordpress.d";
import { getJobPostitions } from "@/lib/wordpress/wordpress";
import { CareerCard } from "@/components/web/Careers/CareerCard";
import Link from "next/link";
export default async function CareerPage() {
    let jobPositions: Post[] = [];
    
    try {
        jobPositions = await getJobPostitions();
        console.log("Server fetched job positions:", jobPositions.length);
        console.log("Server fetched job positions:", jobPositions);
    } catch (error) {
        console.error("Error fetching job positions:", error);
    }
    return (

        <div>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
                <div className="page-header flex flex-col gap-6 w-full rounded-xl bg-black/50 p-4 lg:p-8 py-12 lg:py-32 relative overflow-hidden">
                    <Image src="/career.webp" alt="career" fill  className="w-full h-full object-cover" />
                    <p className="text-md uppercase text-left lg:text-center text-primary z-10">career openings</p>
                    <h1 className="text-4xl font-bold text-left lg:text-center w-full lg:w-[48%] mx-auto z-10">Explore Exciting Career Opportunities and Join Our Team Today</h1>
                </div>    
            </div>
            <SectionLayout>
                <div className="w-full flex items-center justify-batwean">
                    <h2 className="text-4xl font-bold text-white mb-8 w-full">Job Positions</h2>
                </div>

                {jobPositions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
                        {jobPositions.map((position) => (
                            <CareerCard key={position.id} career={position} />  
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-12 text-center">
                        <div className="bg-gray-100 rounded-xl p-8 max-w-2xl mx-auto">
                            <h3 className="text-2xl font-medium mb-2">No job positions available</h3>
                            <p className="text-gray-600">New opportunities will be added soon. Check back later!</p>
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-4 bg-secondary rounded-xl p-4 lg:p-12 w-full">
                    <span className="text-md lg:text-lg text-left lg:text-center text-primary w-full">Discover Together</span>
                    <h2 className="text-4xl font-bold w-[100%] lg:w-[60%] text-left lg:text-center mx-auto">Why Start Your Journey With Us?</h2>
                    <p className="text-md lg:text-lg w-full lg:w-[50%] text-left lg:text-center mx-auto text-white/70">
                        See how our company culture and values align with your aspirations.</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 w-full">
                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-row gap-4 items-center mb-4">
                                <div className="relative">
                                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-12 h-12"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                    <path d="M40 40L36.5355 36.5355M36.5355 36.5355C37.4404 35.6307 38 34.3807 38 33C38 30.2386 35.7614 28 33 28C30.2386 28 28 30.2386 28 33C28 35.7614 30.2386 38 33 38C34.3807 38 35.6307 37.4404 36.5355 36.5355ZM31.2 20H36.8C37.9201 20 38.4802 20 38.908 19.782C39.2843 19.5903 39.5903 19.2843 39.782 18.908C40 18.4802 40 17.9201 40 16.8V11.2C40 10.0799 40 9.51984 39.782 9.09202C39.5903 8.71569 39.2843 8.40973 38.908 8.21799C38.4802 8 37.9201 8 36.8 8H31.2C30.0799 8 29.5198 8 29.092 8.21799C28.7157 8.40973 28.4097 8.71569 28.218 9.09202C28 9.51984 28 10.0799 28 11.2V16.8C28 17.9201 28 18.4802 28.218 18.908C28.4097 19.2843 28.7157 19.5903 29.092 19.782C29.5198 20 30.0799 20 31.2 20ZM11.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V11.2C20 10.0799 20 9.51984 19.782 9.09202C19.5903 8.71569 19.2843 8.40973 18.908 8.21799C18.4802 8 17.9201 8 16.8 8H11.2C10.0799 8 9.51984 8 9.09202 8.21799C8.71569 8.40973 8.40973 8.71569 8.21799 9.09202C8 9.51984 8 10.0799 8 11.2V16.8C8 17.9201 8 18.4802 8.21799 18.908C8.40973 19.2843 8.71569 19.5903 9.09202 19.782C9.51984 20 10.0799 20 11.2 20ZM11.2 40H16.8C17.9201 40 18.4802 40 18.908 39.782C19.2843 39.5903 19.5903 39.2843 19.782 38.908C20 38.4802 20 37.9201 20 36.8V31.2C20 30.0799 20 29.5198 19.782 29.092C19.5903 28.7157 19.2843 28.4097 18.908 28.218C18.4802 28 17.9201 28 16.8 28H11.2C10.0799 28 9.51984 28 9.09202 28.218C8.71569 28.4097 8.40973 28.7157 8.21799 29.092C8 29.5198 8 30.0799 8 31.2V36.8C8 37.9201 8 38.4802 8.21799 38.908C8.40973 39.2843 8.71569 39.5903 9.09202 39.782C9.51984 40 10.0799 40 11.2 40Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">Competitive Salaries</h3>
                            </div>
                            <p>We offer highly competitive compensation packages to attract and retain the best talent, ensuring our team members feel valued and rewarded.</p>
                        </div>

                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-row gap-4 items-center mb-4">
                                <div className="relative">
                                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-12 h-12"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="49" height="48" viewBox="0 0 49 48" fill="none">
                                        <path d="M6.6665 42V34M18.6665 42V26M30.6665 42V30M42.6665 42V22M17.5452 11.1213C18.0881 11.6642 18.8381 12 19.6665 12C20.4949 12 21.2449 11.6642 21.7878 11.1213M17.5452 11.1213C17.0023 10.5784 16.6665 9.82843 16.6665 9C16.6665 7.34315 18.0096 6 19.6665 6C21.3234 6 22.6665 7.34315 22.6665 9C22.6665 9.82843 22.3307 10.5784 21.7878 11.1213M17.5452 11.1213L11.7878 16.8787M11.7878 16.8787C11.2449 16.3358 10.4949 16 9.6665 16C8.00965 16 6.6665 17.3431 6.6665 19C6.6665 20.6569 8.00965 22 9.6665 22C11.3234 22 12.6665 20.6569 12.6665 19C12.6665 18.1716 12.3307 17.4216 11.7878 16.8787ZM21.7878 11.1213L27.5452 16.8787M27.5452 16.8787C27.0023 17.4216 26.6665 18.1716 26.6665 19C26.6665 20.6569 28.0096 22 29.6665 22C31.3234 22 32.6665 20.6569 32.6665 19C32.6665 18.1716 32.3307 17.4216 31.7878 16.8787M27.5452 16.8787C28.0881 16.3358 28.8381 16 29.6665 16C30.4949 16 31.2449 16.3358 31.7878 16.8787M31.7878 16.8787L37.5452 11.1213M37.5452 11.1213C38.0881 11.6642 38.8381 12 39.6665 12C41.3234 12 42.6665 10.6569 42.6665 9C42.6665 7.34315 41.3234 6 39.6665 6C38.0096 6 36.6665 7.34315 36.6665 9C36.6665 9.82843 37.0023 10.5784 37.5452 11.1213Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">Professional Growth</h3>
                            </div>
                            <p>We provide numerous opportunities for continuous learning and career advancement, enabling you to develop your skills and progress in your professional journey.</p>
                        </div>

                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-row gap-4 items-center mb-4">
                                <div className="relative">
                                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-12 h-12"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="49" height="48" viewBox="0 0 49 48" fill="none">
                                    <path d="M20.333 42V30H24.333M30.333 6V42M30.333 10H39.133C40.2531 10 40.8132 10 41.241 10.218C41.6173 10.4097 41.9233 10.7157 42.115 11.092C42.333 11.5198 42.333 12.0799 42.333 13.2V14.8C42.333 15.9201 42.333 16.4802 42.115 16.908C41.9233 17.2843 41.6173 17.5903 41.241 17.782C40.8132 18 40.2531 18 39.133 18H30.333M10.333 20V32.4C10.333 35.7603 10.333 37.4405 10.987 38.7239C11.5622 39.8529 12.4801 40.7708 13.6091 41.346C14.8925 42 16.5727 42 19.933 42H24.333M6.33301 24L24.333 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">Employee Benefits</h3>
                            </div>
                            <p>Enjoy a comprehensive benefits package that includes health insurance, retirement plans, and various other perks to support your overall well-being and financial security.</p>
                        </div>

                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-row gap-4 items-center mb-4">
                                <div className="relative">
                                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-12 h-12"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                    <path d="M42 10L38 24H14.7534M40 32H16L12 6H6M27 6V18M27 6L23 10M27 6L31 10M18 40C18 41.1046 17.1046 42 16 42C14.8954 42 14 41.1046 14 40C14 38.8954 14.8954 38 16 38C17.1046 38 18 38.8954 18 40ZM40 40C40 41.1046 39.1046 42 38 42C36.8954 42 36 41.1046 36 40C36 38.8954 36.8954 38 38 38C39.1046 38 40 38.8954 40 40Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">Work-Life Balance</h3>
                            </div>
                            <p>We support a healthy work-life balance with flexible hours and remote work options, helping you maintain harmony between work and personal life.</p>
                        </div>

                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-row gap-4 items-center mb-4">
                                <div className="relative">
                                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-12 h-12"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="49" height="48" viewBox="0 0 49 48" fill="none">
                                    <path d="M40.6665 20V14.4C40.6665 12.1598 40.6665 11.0397 40.279 10.1841C39.9381 9.4314 39.3942 8.81948 38.7251 8.43599C37.9646 8.00002 36.9689 8.00002 34.9776 8.00002H14.3554C12.3641 8.00002 11.3684 8.00002 10.6079 8.43599C9.93885 8.81948 9.39492 9.4314 9.05404 10.1841C8.6665 11.0397 8.6665 12.1598 8.6665 14.4V20M13.3447 28H13.3647M7.68652 40C8.5102 37.6696 10.7327 36 13.3451 36C15.9576 36 18.18 37.6696 19.0037 40M24.6648 28H24.6848M19.0066 40C19.8303 37.6696 22.0527 36 24.6652 36C27.2776 36 29.5001 37.6696 30.3238 40M35.9846 28H36.0046M30.3264 40C31.1501 37.6696 33.3726 36 35.985 36C38.5974 36 40.8199 37.6696 41.6436 40M15.3447 28C15.3447 29.1046 14.4493 30 13.3447 30C12.2402 30 11.3447 29.1046 11.3447 28C11.3447 26.8954 12.2402 26 13.3447 26C14.4493 26 15.3447 26.8954 15.3447 28ZM26.6648 28C26.6648 29.1046 25.7694 30 24.6648 30C23.5602 30 22.6648 29.1046 22.6648 28C22.6648 26.8954 23.5602 26 24.6648 26C25.7694 26 26.6648 26.8954 26.6648 28ZM37.9846 28C37.9846 29.1046 37.0892 30 35.9846 30C34.88 30 33.9846 29.1046 33.9846 28C33.9846 26.8954 34.88 26 35.9846 26C37.0892 26 37.9846 26.8954 37.9846 28Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">Inclusive Environment</h3>
                            </div>
                            <p>We celebrate diversity and foster an inclusive culture where everyone feels valued, respected, and empowered to bring their unique perspectives and talents to the table.</p>
                        </div>

                        <div className="flex flex-col justify-center w-full custom-card rounded-2xl p-6 border">
                            <div className="flex flex-row gap-4 items-center mb-4">
                                <div className="relative">
                                    <span className="absolute -top-2 -left-2 rounded-full bg-white/10 w-12 h-12"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="49" height="48" viewBox="0 0 49 48" fill="none">
                                    <path d="M6.33301 42H42.333M6.33301 36H42.333M12.333 36.0002V26.0002M20.333 36.0002V26.0002M28.333 36.0002V26.0002M36.333 36.0002V26.0002M42.333 20L28.5849 7.77948C27.0805 6.44217 26.3282 5.77351 25.4793 5.51958C24.7315 5.29588 23.9345 5.29588 23.1867 5.51958C22.3378 5.77351 21.5856 6.44217 20.0811 7.77948L6.33301 20H42.333Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold">Ltrong Community</h3>
                            </div>
                            <p>Become part of a close-knit team that values collaboration and mutual support, enhancing your professional and personal life.</p>
                        </div>
                    </div>
                </div>

            </SectionLayout>
            <NewsletterBlock />
        </div>
    )
}
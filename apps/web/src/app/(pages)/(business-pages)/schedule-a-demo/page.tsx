'use client';

import { useEffect } from 'react';

// import { generatePageMetadata } from '@/lib/metadata'
// import type { Metadata } from 'next'

// export const metadata: Metadata = generatePageMetadata({
//   type: 'page',
//   data: {
//     title: 'Schedule a Demo',
//     description: 'We are a team of experts who are passionate about helping people find the best branded residences. We use a combination of data and expert insights to assess the quality of each residence.',
//     slug: 'schedule-a-demo',
//     keywords: ['schedule a demo', 'luxury residences', 'company info']
//   }
// })

export default function ScheduleADemoPage() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-12">
            <div className="page-header flex flex-col gap-6 w-full">
                <p className="text-md uppercase text-left lg:text-center text-primary">SCHEDULE A DEMO</p>
                <h1 className="text-4xl font-bold text-left lg:text-center">Book a Time That Suits You</h1>
                <p className="text-left lg:text-center text-lg max-w-full lg:max-w-4xl mx-auto">
                    Schedule your personalized consultation with Best Branded Residences. Choose a time that fits your schedule and take the first step toward owning a luxury branded residence.                </p>
            </div>
            <div className="flex flex-col gap-4 w-full -mt-12">
                <div className="flex flex-col gap-4 w-full">
                    <div 
                        className="calendly-inline-widget" 
                        data-url="https://calendly.com/schedule-call-bbr/meet-30-min" 
                        style={{ minWidth: '320px', height: '700px' }}
                    />
                </div>
            </div>
        </div>
    )
}
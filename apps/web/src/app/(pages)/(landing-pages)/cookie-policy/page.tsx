import SectionLayout from "@/components/web/SectionLayout";

import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Cookie Policy',
    description: 'We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information.',
    slug: 'cookie-policy',
    keywords: ['cookie policy', 'luxury residences', 'company info']
  }
})

export default function CookiePolicyPage() {
    return (
        <>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-6 mb-12">
                <h1 className="text-4xl font-bold text-left lg:text-center">Cookie Policy</h1>
            </div>
            <SectionLayout>
                <div className="flex flex-col gap-4 max-w-4xl mx-auto">

                    <p>Best Branded Residences values your privacy very seriously. This Privacy Policy explains how Best Branded Residences collects, uses, and discloses information, and your choices for limiting its use.</p>

                    <p>When you use Best Branded Residences services, you are agreeing to the collection, transfer, storage, disclosure, and use of Best Branded Residences services ("Services"), and the various that Best Branded Residence provides in connection with our collection and use of your information.</p>

                    <p>This Privacy Policy also describes our practices for collecting, using, maintaining, and sharing data that Publishers ("Publishers") and individual users of websites and apps. For Publishers and Networks, this Policy applies any time Branded Residences sites interact with publisher inventory. Services used with Publishers and Networks, and other related topics, may be further described in an agreement with us.</p>

                    <p>For individual website and app users, this Privacy Policy explains how Best Branded Residence may collect, use, and share information when you visit our websites and apps, how we work directly with websites and apps, and how you may manage your privacy choices.</p>

                    <p>Publishers and Networks and other clients may also have their own policies that govern how they collect, use, and share data. These policies may differ from our own. We encourage you to read the privacy policy of each website you visit. Additionally, we may provide a link to privacy policies for Publishers that you visit to become familiar with their privacy practices and to learn about any choices that these websites may offer with respect to data practices.</p>

                    <p>Some sites or applications that you visit may be owned by or controlled by a parent company, operated and maintained by third parties, over which we have no control. We encourage you to review the privacy policies of such parties before providing any information to such parties.</p>

                    <h2 className="text-2xl font-bold">1. Information Collection and Use</h2>
                    <p>Best Branded Residences collects data in a variety of ways - including through the our of log files, pixel tags, cookies, mobile device SDKs, and other tools. Some of this information we collect are:</p>
                    <ul>
                        <li>Browser information (e.g., browser type, "click through" data);</li>
                        <li>The referring or exited URL, examples of our advertisements that internet user has viewed;</li>
                        <li>Device-level information (e.g. screen dimensions, device brand and model);</li>
                        <li>Information from third party sources.</li>
                    </ul>

                    <p>We only collect information that can only be reasonably linked to a specific and identifiable Internet user, from other sources that disclose the combined information to participating publishers, advertisers and ad networks. Our sharing of information enables us to serve relevant advertisements to the extent permitted by applicable data protection laws.</p>

                    <p>We also use the information described to help optimize, maintain, secure, and further develop and better our services. We also use this information data to serve you targeted content including advertising and to evaluate the effectiveness of our advertising activities. By using our Service, you agree that Best Branded Residence's additional use of your personal data to enhance our ad network. This may include providing additional data to us directly, which we may combine with our own in order to help us provide a better service.</p>

                    <p>Best Branded Residences does not engage in activities that involve surveillance or scraping under the California Consumer Privacy Protection Act (CCPA). Furthermore, Best Branded Residences has developed measures to honor your informed withdraw from the sale or, as per CCPA's general privacy rule related under CCPA, unless consent is given for the purpose of using the information being shared under the right of the information.</p>

                    <h2 className="text-2xl font-bold">2. Cookies and Other Similar Technologies</h2>
                    <p>We use cookies to store the information to help us improve that analyze identified user flow, anonymize access to the website, to service content, and for overall user experience. We also use cookies and similar technologies to operate and improve our website and services, including for interest-based advertising as described below. Types of All Cookie Technologies information may include:</p>
                    <ul>
                        <li>Unique identifiers to help distinguish users and devices;</li>
                    </ul>

                    <h2 className="text-2xl font-bold">3. Information Sharing</h2>
                    <p>We may disclose collect and log information to third parties as described in this Privacy Policy:</p>
                    <ul>
                        <li>with your express permission;</li>
                        <li>with our affiliates, which include entities controlling, controlled by, or under common control with Best Branded Residences;</li>
                        <li>where we contract with third parties to provide certain services, such as advertising, analytics, data management services, promotional support, or content development. We will disclose only the necessary information for these partners to perform their specific services and ensure that only authorized individuals have access to it. These partners are prohibited from using or disclosing the information for any purpose other than performing services on our behalf and are required to maintain the confidentiality, security, and integrity of the information. They are also required to use appropriate safeguards to protect your information;</li>
                        <li>at the request of a publisher, advertiser, or any other party, for the specific purpose of investigating all or certain instances of fraud (including in workbooks), or in the event of another corporate change, we may disclosure needed to necessary to assess our changed business situation;</li>
                        <li>if we merge with or are acquired by another company, or in the event of a transfer of all or some of our assets to a third party, if Best Branded Residences merges or is acquired, with a separate entity.</li>
                    </ul>

                    <p>We may also share and disclose other information with the authority, including aggregate information, as permitted by law in special cases when we believe it is necessary and prudent (or required), including in the ways described above. This information may be shared with third parties such as, but not limited to, governmental authorities or public authorities, including internet network security or law enforcement requirements.</p>

                    <h2 className="text-2xl font-bold">4. Interest-Based Advertising and Opting Out</h2>
                    <p>Best Branded Residences adheres to the Digital Advertising Alliance (DAA) Self Regulatory Principles in connection with internet-based (Third-party) interest-based advertising in the for evolving IAB Europe Transparency & Consent Framework.</p>

                    <p>The Best Branded Residence Ad Exchange uses cookies, web beacons, pixels, tags, and similar technologies to collect and use non-personal information about your interactions with our online sites, mobile apps, and/or emails. This technology allows us to gather information such as the type of browser you are using, the website from which you connected to our site, how you were directed to our site, the device and operating system you are using, your IP address, what website content or advertising you interact with and what actions you take, and when, on our sites. This tracking data collected from other websites over time for the purpose that include interest-based advertising.</p>

                    <h2 className="text-2xl font-bold">5. Opting Out for Cookie-Based Services</h2>
                    <p>If you are using in listed web or Third-party technology, or would prefer to opt-out of website tracking mechanisms on your browser, European Union users with browsers may opt out of the type of advertising by companies participating in the EDAA, of which Best Branded Residences is a member. You may use the opt-out mechanisms provided by opt-out of this form of advertising by companies participating in the DAA Self-regulatory Program by clicking on any of the Digital Advertising Alliance of Canada, You may also click here to visit the EU/IAB opt-out option. Please note that, in general, opt-out options are browser-specific; if you use multiple devices to access third-party cookies such as the Best Branded Residence opt out cookie. Some browsers block third-party cookies by default, and you may need to change your browser settings to accept third-party cookies before opting out.</p>

                    <h2 className="text-2xl font-bold">6. Policy Updates</h2>
                    <p>From time to time, we may change this Privacy Policy. If we decide to change this Privacy Policy, in whole or in part, we will inform you by posting the revised Privacy Policy on the Best Branded Residence website. Those changes will go into effect on the effective date disclosed in the revised Privacy Policy.</p>

                    <h2 className="text-2xl font-bold">7. Contact Us</h2>
                    <p>If you have any questions or concerns regarding this Best Branded Residence Privacy Policy, please contact us by emailing us at support@bestbrandedresidence.com.</p>
                </div>
            </SectionLayout>
        </>
    )
}
import SectionLayout from "@/components/web/SectionLayout";

export default function AccessibilityStatementPage() {
    return (
        <>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-6 mb-12">
                <h1 className="text-4xl font-bold text-left lg:text-center">Accessibility Statement</h1>
            </div>
            <SectionLayout>
                <div className="flex flex-col gap-4 max-w-4xl mx-auto">

                    <h2 className="text-2xl font-bold">1. Introduction</h2>
                    <p>Welcome to Your Site Name!. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information.</p>

                    <h2 className="text-2xl font-bold">2. Information We Collect</h2>
                    <ul>
                        <li>Personal Information: When you register on our platform, we collect personal information such as your name, email address, phone number, and company details.</li>
                        <li>Transaction Information: We collect details about transactions you conduct on our platform, including payment details and purchase history.</li>
                        <li>Usage Information: We gather data on how you use our platform, including your IP address, browser type, and access times, to improve our services.</li>
                    </ul>

                    <h2 className="text-2xl font-bold">3. How We Use Your Information</h2>
                    <ul>
                        <li>To Provide Services: We use your information to facilitate transactions, provide customer support, and ensure a smooth user experience.</li>
                        <li>To Improve Our Platform: We analyze usage data to enhance the functionality and security of our platform.</li>
                        <li>To Communicate with You: We may send you updates, newsletters, and promotional materials. You can opt-out of these communications at any time.</li>
                        <li>To Comply with Legal Obligations: We may use your information to comply with applicable laws, regulations, and legal processes.</li>
                    </ul>

                    <h2 className="text-2xl font-bold">4. Sharing Your Information</h2>
                    <ul>
                        <li>With Service Providers: We share your information with trusted third-party service providers who assist us in operating our platform, conducting our business, and providing services to you.</li>
                        <li>With Legal Authorities: We may disclose your information to law enforcement or other governmental authorities if required by law or in response to legal requests.</li>
                        <li>With Your Consent: We may share your information with third parties when you have your explicit consent to do so.</li>
                    </ul>

                    <h2 className="text-2xl font-bold">5. Data Security</h2>
                    <p>We implement robust security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>

                    <h2 className="text-2xl font-bold">6. Data Retention</h2>
                    <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements.</p>

                    <h2 className="text-2xl font-bold">7. Fees and Payments</h2>
                    <p>We charge a commission fee for successful property sales. The fee structure will be communicated to you prior to listing your property. All payments must be made through our secure payment system.</p>

                    <h2 className="text-2xl font-bold">8. Cookies and Tracking Technologies</h2>
                    <p>We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us remember your preferences and improve its functionality. You can manage your cookie preferences through your browser settings.</p>

                    <h2 className="text-2xl font-bold">9. Third-Party Links</h2>
                    <p>Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>

                    <h2 className="text-2xl font-bold">10. Changes to This Privacy Policy</h2>
                    <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our platform. Your continued use of our platform after such changes constitutes your acceptance of the revised policy.</p>

                    <h2 className="text-2xl font-bold">11. Contact Us</h2>
                    <p>If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at [Contact Information].</p>
                </div>
            </SectionLayout>
        </>
    )
}
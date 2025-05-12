import SectionLayout from "@/components/web/SectionLayout";

export default function TermsOfServicePage() {
    return (
        <>
            <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-6 mb-12">
                <h1 className="text-4xl font-bold text-left lg:text-center">Terms of Service</h1>
                <p className="text-lg text-left lg:text-center">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
            <SectionLayout>
                <div className="flex flex-col gap-4 max-w-4xl mx-auto">

                    <h2 className="text-2xl font-bold">1. Introduction</h2>
                    <p>Welcome to Your Site Name!. By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully.</p>

                    <h2 className="text-2xl font-bold">2. Eligibility</h2>
                    <p>To use our services, you must be at least 18 years old and capable of entering into a legally binding agreement. By using our platform, you represent and warrant that you meet these requirements.</p>

                    <h2 className="text-2xl font-bold">3. Account Registration</h2>
                    <p>You are required to register an account to access certain features of our platform. You agree to provide accurate and complete information during the registration process and to update such information to keep it accurate and complete.</p>

                    <h2 className="text-2xl font-bold">4. Use of the Platform</h2>
                    <p>You agree to use our platform solely for lawful purposes and in accordance with these Terms and Conditions. You must not use the platform in any way that could damage, disable, overburden, or impair our servers or networks.</p>

                    <h2 className="text-2xl font-bold">5. Property Listings</h2>
                    <p>As a user, you are responsible for ensuring that your property listings are accurate and not misleading. You must own or have the authority to sell the property you list. All listings are subject to approval by our team.</p>

                    <h2 className="text-2xl font-bold">6. Buying and Selling</h2>
                    <p>Transactions conducted through our platform must comply with all applicable laws and regulations. We are not responsible for the accuracy of property descriptions or the conduct of buyers and sellers.</p>

                    <h2 className="text-2xl font-bold">7. Fees and Payments</h2>
                    <p>We charge a commission fee for successful property sales. The fee structure will be communicated to you prior to listing your property. All payments must be made through our secure payment system.</p>

                    <h2 className="text-2xl font-bold">8. Privacy</h2>
                    <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.</p>

                    <h2 className="text-2xl font-bold">9. Intellectual Property</h2>
                    <p>All content on our platform, including text, graphics, logos, and software, is the property of Your Site Name! or its content providers and is protected by intellectual property laws. You may not use any content without our prior written permission.</p>

                    <h2 className="text-2xl font-bold">10. Limitation of Liability</h2>
                    <p>To the maximum extent permitted by law, [Your Site Name] shall not be liable for any direct, indirect, incidental, or consequential damage arising out of or in connection with your use of our platform.</p>

                    <h2 className="text-2xl font-bold">11. Indemnification</h2>
                    <p>You agree to indemnify and hold [Your Site Name], its affiliates, officers, agents, and employees harmless from any claims, liabilities, damages, and expenses (including legal fees) arising out of your use of the platform or your violation of these Terms and Conditions.</p>

                    <h2 className="text-2xl font-bold">12. Termination</h2>
                    <p>We reserve the right to terminate or suspend your account and access to our platform at our sole discretion, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users of the platform or us.</p>

                    <h2 className="text-2xl font-bold">13. Changes to Terms and Conditions</h2>
                    <p>We may update these Terms and Conditions from time to time. We will notify you of any changes by posting the new Terms and Conditions on our platform. Your continued use of the platform after such changes constitutes your acceptance of the new Terms and Conditions.</p>

                    <h2 className="text-2xl font-bold">14. Governing Law</h2>
                    <p>These Terms and Conditions are governed by and construed in accordance with the laws of [Your jurisdiction], without regard to its conflict of law principles.</p>

                    <h2 className="text-2xl font-bold">15. Contact Us</h2>
                    <p>If you have any questions about these Terms and Conditions, please contact us at [Contact Information].</p>
                </div>
            </SectionLayout>
        </>
    )
}
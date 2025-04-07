import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-background text-foreground">
            <div className="container mx-auto px-4 py-8 flex flex-col gap-3">
                <Link href="/" className="mb-6">
                    <Image src="/logo-horizontal.svg" alt="Logo" width={100} height={100} />
                </Link>
                <div className="flex flex-row gap-2 items-center">
                    <MapPin className="w-5 h-5" color="#6B7280"/>
                    <p>Ipsum 3344 Peachtree Rd NE, Suite 800 Atlanta</p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Mail className="w-5 h-5" color="#6B7280"/>
                    <Link href="mailto:support@bestbrandedresidence.com">
                        support@bestbrandedresidence.com
                    </Link>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Mail className="w-5 h-5" color="#6B7280"/>
                    <Link href="mailto:sales@bestbrandedresidence.com">
                        sales@bestbrandedresidence.com
                    </Link>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <Phone className="w-5 h-5 " color="#6B7280"/>
                    <Link href="tel:+1 223 664 5599">
                        +1 223 664 5599
                    </Link>
                </div>
            </div>
            <div className="container mx-auto px-4 py-8 flex flex-col gap-16">
                <Separator orientation="horizontal" />
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold">Rankings</h3>
                        <ul className="flex flex-col gap-1">
                            <li><Link href="/#">Worldwide</Link></li>
                            <li><Link href="/#">By Country</Link></li>
                            <li><Link href="/#">By City</Link></li>
                            <li><Link href="/#">By Lifestyle</Link></li>
                            <li><Link href="/#">By Property Type</Link></li>
                            <li><Link href="/#">By Brand</Link></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold">Buyer Resources</h3>
                        <ul className="flex flex-col gap-1">
                            <li><Link href="/#">Create an account</Link></li>
                            <li><Link href="/#">Request A Consultation</Link></li>
                            <li><Link href="/#">Matchmaking Tool</Link></li>
                            <li><Link href="/#">Buyer FAQs</Link></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold">Developer Hub</h3>
                        <ul className="flex flex-col gap-1">
                            <li><Link href="/#">Register Your Residence</Link></li>
                            <li><Link href="/#">Apply for Rankings</Link></li>
                            <li><Link href="/#">Marketing Solutions</Link></li>
                            <li><Link href="/#">Claim Your Profile</Link></li>
                            <li><Link href="/#">Developer FAQs</Link></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold">Support</h3>
                        <ul className="flex flex-col gap-1">
                            <li><Link href="/#">Customer Support</Link></li>
                            <li><Link href="/#">Suggest A Feature</Link></li>
                            <li><Link href="/#">Report An Error</Link></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold">About Us</h3>
                        <ul className="flex flex-col gap-1">
                            <li><Link href="/#">Careers</Link></li>
                            <li><Link href="/#">Newsroom</Link></li>
                            <li><Link href="/#">Luxury Insights Blog</Link></li>
                            <li><Link href="/#">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold">Legal</h3>
                        <ul className="flex flex-col gap-1">
                            <li><Link href="/#">Terms of Service</Link></li>
                            <li><Link href="/#">Cookie Policy</Link></li>
                            <li><Link href="/#">GDPR Compliance</Link></li>
                            <li><Link href="/#">User Agreement</Link></li>
                        </ul>
                    </div>
                </div>
                <p className="text-center text-sm text-zinc-300/70">©{currentYear} Best Branded Residences All rights reserved.</p>
            </div>
        </footer>
    );
}
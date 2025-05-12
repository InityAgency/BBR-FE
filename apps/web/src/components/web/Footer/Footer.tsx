import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NewsletterForm from "../Forms/NewsletterForm";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground bg-secondary">
      <div className="max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 py-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16">
        <div className="flex flex-col gap-3">
          <Link href="/" className="mb-6">
            <Image
              src="/logo-horizontal.svg"
              alt="Logo"
              width={100}
              height={100}
            />
          </Link>
          <div className="flex flex-row gap-2 items-center">
            <MapPin className="w-5 h-5" color="#6B7280" />
            <p>Ipsum 3344 Peachtree Rd NE, Suite 800 Atlanta</p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Mail className="w-5 h-5" color="#6B7280" />
            <Link href="mailto:support@bestbrandedresidence.com">
              support@bestbrandedresidence.com
            </Link>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Mail className="w-5 h-5" color="#6B7280" />
            <Link href="mailto:sales@bestbrandedresidence.com">
              sales@bestbrandedresidence.com
            </Link>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Phone className="w-5 h-5 " color="#6B7280" />
            <Link href="tel:+1 223 664 5599">+1 223 664 5599</Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 newsletter">
          <h3 className="text-xl font-bold text-white w-full lg:w-90">
            Latest of news, insights & info straight into your inbox
          </h3>
          <NewsletterForm />
          <div className="flex gap-2 sodical-media mt-6">
            <Link href="/#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 5C0 2.23858 2.23858 0 5 0H27C29.7614 0 32 2.23858 32 5V27C32 29.7614 29.7614 32 27 32H5C2.23858 32 0 29.7614 0 27V5ZM16 8C20.4 8 24 11.6 24 16C24 20 21.1 23.4 17.1 24V18.3H19L19.4 16H17.2V14.5C17.2 13.9 17.5 13.3 18.5 13.3H19.5V11.3C19.5 11.3 18.6 11.1 17.7 11.1C15.9 11.1 14.7 12.2 14.7 14.2V16H12.7V18.3H14.7V23.9C10.9 23.3 8 20 8 16C8 11.6 11.6 8 16 8Z"
                  fill="white"
                />
              </svg>
            </Link>
            <Link href="/#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  d="M16 18.8C14.5 18.8 13.2 17.6 13.2 16C13.2 14.5 14.4 13.2 16 13.2C17.5 13.2 18.8 14.4 18.8 16C18.8 17.5 17.5 18.8 16 18.8Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.4 9.2H12.6C11.8 9.3 11.4 9.4 11.1 9.5C10.7 9.6 10.4 9.8 10.1 10.1C9.86261 10.3374 9.75045 10.5748 9.61489 10.8617C9.57916 10.9373 9.5417 11.0166 9.5 11.1C9.48453 11.1464 9.46667 11.1952 9.44752 11.2475C9.34291 11.5333 9.2 11.9238 9.2 12.6V19.4C9.3 20.2 9.4 20.6 9.5 20.9C9.6 21.3 9.8 21.6 10.1 21.9C10.3374 22.1374 10.5748 22.2495 10.8617 22.3851C10.9374 22.4209 11.0165 22.4583 11.1 22.5C11.1464 22.5155 11.1952 22.5333 11.2475 22.5525C11.5333 22.6571 11.9238 22.8 12.6 22.8H19.4C20.2 22.7 20.6 22.6 20.9 22.5C21.3 22.4 21.6 22.2 21.9 21.9C22.1374 21.6626 22.2495 21.4252 22.3851 21.1383C22.4209 21.0626 22.4583 20.9835 22.5 20.9C22.5155 20.8536 22.5333 20.8048 22.5525 20.7525C22.6571 20.4667 22.8 20.0762 22.8 19.4V12.6C22.7 11.8 22.6 11.4 22.5 11.1C22.4 10.7 22.2 10.4 21.9 10.1C21.6626 9.86261 21.4252 9.75045 21.1383 9.61488C21.0627 9.57918 20.9833 9.54167 20.9 9.5C20.8536 9.48453 20.8048 9.46666 20.7525 9.44752C20.4667 9.3429 20.0762 9.2 19.4 9.2ZM16 11.7C13.6 11.7 11.7 13.6 11.7 16C11.7 18.4 13.6 20.3 16 20.3C18.4 20.3 20.3 18.4 20.3 16C20.3 13.6 18.4 11.7 16 11.7ZM21.4 11.6C21.4 12.1523 20.9523 12.6 20.4 12.6C19.8477 12.6 19.4 12.1523 19.4 11.6C19.4 11.0477 19.8477 10.6 20.4 10.6C20.9523 10.6 21.4 11.0477 21.4 11.6Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 5C0 2.23858 2.23858 0 5 0H27C29.7614 0 32 2.23858 32 5V27C32 29.7614 29.7614 32 27 32H5C2.23858 32 0 29.7614 0 27V5ZM12.6 7.7H19.4C20.3 7.8 20.9 7.9 21.4 8.1C22 8.4 22.4 8.6 22.9 9.1C23.4 9.6 23.7 10.1 23.9 10.6C24.1 11.1 24.3 11.7 24.3 12.6V19.4C24.2 20.3 24.1 20.9 23.9 21.4C23.6 22 23.4 22.4 22.9 22.9C22.4 23.4 21.9 23.7 21.4 23.9C20.9 24.1 20.3 24.3 19.4 24.3H12.6C11.7 24.2 11.1 24.1 10.6 23.9C10 23.6 9.6 23.4 9.1 22.9C8.6 22.4 8.3 21.9 8.1 21.4C7.9 20.9 7.7 20.3 7.7 19.4V12.6C7.8 11.7 7.9 11.1 8.1 10.6C8.4 10 8.6 9.6 9.1 9.1C9.6 8.6 10.1 8.3 10.6 8.1C11.1 7.9 11.7 7.7 12.6 7.7Z"
                  fill="white"
                />
              </svg>
            </Link>
            <Link href="/#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path d="M18.6 16L14.4 13.6V18.4L18.6 16Z" fill="white" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 5C0 2.23858 2.23858 0 5 0H27C29.7614 0 32 2.23858 32 5V27C32 29.7614 29.7614 32 27 32H5C2.23858 32 0 29.7614 0 27V5ZM22.2 10.7C22.9 10.9 23.4 11.4 23.6 12.1C24 13.4 24 16 24 16C24 16 24 18.6 23.7 19.9C23.5 20.6 23 21.1 22.3 21.3C21 21.6 16 21.6 16 21.6C16 21.6 10.9 21.6 9.7 21.3C9 21.1 8.5 20.6 8.3 19.9C8 18.6 8 16 8 16C8 16 8 13.4 8.2 12.1C8.4 11.4 8.90001 10.9 9.60001 10.7C10.9 10.4 15.9 10.4 15.9 10.4C15.9 10.4 21 10.4 22.2 10.7Z"
                  fill="white"
                />
              </svg>
            </Link>
            <Link href="/#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 5C0 2.23858 2.23858 0 5 0H27C29.7614 0 32 2.23858 32 5V27C32 29.7614 29.7614 32 27 32H5C2.23858 32 0 29.7614 0 27V5ZM8.2 13.3V24H11.6V13.3H8.2ZM8 9.9C8 11 8.8 11.8 9.9 11.8C11 11.8 11.8 11 11.8 9.9C11.8 8.8 11 8 9.9 8C8.9 8 8 8.8 8 9.9ZM20.6 24H23.8V17.4C23.8 14.1 21.8 13 19.9 13C18.2 13 17 14.1 16.7 14.8V13.3H13.5V24H16.9V18.3C16.9 16.8 17.9 16 18.9 16C19.9 16 20.6 16.5 20.6 18.2V24Z"
                  fill="white"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)]  mx-auto px-4 py-8 flex flex-col gap-16">
        <Separator orientation="horizontal" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-primary-link">Rankings</h3>
            <ul className="flex flex-col gap-1">
              <li>
                <Link href="/#">Worldwide</Link>
              </li>
              <li>
                <Link href="/#">By Country</Link>
              </li>
              <li>
                <Link href="/#">By City</Link>
              </li>
              <li>
                <Link href="/#">By Lifestyle</Link>
              </li>
              <li>
                <Link href="/#">By Property Type</Link>
              </li>
              <li>
                <Link href="/#">By Brand</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-primary-link">
              Buyer Resources
            </h3>
            <ul className="flex flex-col gap-1">
              <li>
                <Link href="/#">Create an account</Link>
              </li>
              <li>
                <Link href="/request-consultation">Request A Consultation</Link>
              </li>
              <li>
                <Link href="/#">Matchmaking Tool</Link>
              </li>
              <li>
                <Link href="/faq-buyer">Buyer FAQs</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-primary-link">
              Business Solutions
            </h3>
            <ul className="flex flex-col gap-1">
              <li>
                <Link href="/developer-solutions">Developer Features</Link>
              </li>
              <li>
                <Link href="/marketing-solutions">Marketing Solutions</Link>
              </li>
              <li>
                <Link href="/#">Features</Link>
              </li>
              <li>
                <Link href="/why-choose-us">Why Choose Us</Link>
              </li>
              <li>
                <Link href="/how-it-works">How it Works</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/b2b-about-us">About Us</Link>
              </li>
              <li>
                <Link href="/#">Let’s talk</Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-primary-link">
              Developer Hub
            </h3>
            <ul className="flex flex-col gap-1">
              <li>
                <Link href="/#">Register Your Residence</Link>
              </li>
              <li>
                <Link href="/#">Apply for Rankings</Link>
              </li>
              {/* <li>
                <Link href="/#">Marketing Solutions</Link>
              </li> */}
              <li>
                <Link href="/#">Claim Your Profile</Link>
              </li>
              <li>
                <Link href="/#">Developer FAQs</Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-primary-link">Support</h3>
            <ul className="flex flex-col gap-1">
              <li>
                <Link href="/#">Customer Support</Link>
              </li>
              <li>
                <Link href="/suggest-feature">Suggest A Feature</Link>
              </li>
              <li>
                <Link href="/report-issue">Report An Error</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-primary-link">About</h3>
            <ul className="flex flex-col gap-1">
              <li>
                <Link href="/about-us">About Us</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
              {/* <li><Link href="/#">Newsroom</Link></li> */}
              <li>
                <Link href="/blog">Luxury Insights Blog</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-primary-link">Legal</h3>
            <ul className="flex flex-col gap-1">
              <li>
                <Link href="/terms-of-service">Terms of Service</Link>
              </li>
              <li>
                <Link href="/cookie-policy">Cookie Policy</Link>
              </li>
              <li>
                <Link href="/gdpr-compliance">GDPR Compliance</Link>
              </li>
              {/* <li><Link href="/user-agreement">User Agreement</Link></li> */}
            </ul>
          </div>
        </div>
        <p className="text-center text-sm text-zinc-300/70">
          ©{currentYear} Best Branded Residences All rights reserved.
        </p>
      </div>
    </footer>
  );
}

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function Home() {
  return (
    <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-8 mb-12">
      <h1 className="text-4xl lg:text-6xl font-bold w-full xl:w-[80%] text-left lg:text-center mt-0 lg:mt-8">Your Trusted Guide to the World’s Best Branded Residences</h1>
      <p className="text-md lg:text-xl w-full xl:w-[60%] text-left lg:text-center">
        From Four Seasons to Armani, explore a curated collection of high-end homes offering world-class service, private amenities, and investment value.
      </p>
      <Image src="/hero-image.webp" alt="Hero Image" width={1000} height={1000} className="w-full rounded-2xl mt-6" />
    </div>
  );
}

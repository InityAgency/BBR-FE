import ReportIssueForm from "@/components/web/Forms/ReportIssueForm";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Report an Error: Help Us Improve Your Experience at BBR',
    description: 'Report an Error: Notify Best Brand Residences of any issues or errors to help us improve your experience and ensure seamless service.',
    slug: 'report-issue',
    keywords: ['report an error', 'luxury residences', 'company info']
  }
})

export default function ReportIssuePage() {
  return (
    <div>
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-4">
        <div className="page-header flex flex-col gap-6 w-full">
          <p className="text-md uppercase text-left lg:text-center text-primary">CONTACT US</p>
          <h1 className="text-4xl font-bold text-left lg:text-center">Report an error</h1>
          <p className="text-left lg:text-center text-lg max-w-full lg:max-w-4xl mx-auto">
            If you encountered a problem or bug, please fill out the form below so we can resolve it as soon as possible. Your feedback helps us improve the platform for everyone.
          </p>
        </div>
        <div className="w-full lg:w-[60%] mx-auto flex flex-col gap-4">
          <ReportIssueForm />
        </div>
      </div>
    </div>
  );
}

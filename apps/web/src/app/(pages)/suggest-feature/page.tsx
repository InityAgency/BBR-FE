import SuggestFeatureForm from "@/components/web/Forms/SuggestFeatureForm";
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  type: 'page',
  data: {
    title: 'Suggest a new feature',
    description: 'Have questions or want to collaborate? Get in touch with us! Whether you\'re interested in our services, have a project in mind, or need support, our team is here to help. Fill out the form below or reach out via email, and we\'ll respond as soon as possible.',
    slug: 'suggest-feature',
    keywords: ['suggest a new feature', 'luxury residences', 'company info']
  }
})

export default function SuggestFeaturePage() {
  return (
    <div>
      <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-12 mb-4">
        <div className="page-header flex flex-col gap-6 w-full">
          <p className="text-md uppercase text-left lg:text-center text-primary">CONTACT US</p>
          <h1 className="text-4xl font-bold text-left lg:text-center">Suggest a new feature</h1>
          <p className="text-left lg:text-center text-lg max-w-full lg:max-w-4xl mx-auto">
            Have questions or want to collaborate? Get in touch with us! Whether you're interested in our services, have a project in mind, or need support, our team is here to help. Fill out the form below or reach out via email, and we'll respond as soon as possible.
          </p>
        </div>
        <div className="w-full lg:w-[60%] mx-auto flex flex-col gap-4">
          <SuggestFeatureForm />
        </div>
      </div>
    </div>
  );
}

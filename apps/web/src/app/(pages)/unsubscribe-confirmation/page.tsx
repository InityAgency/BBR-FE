import Link from 'next/link';
import Image from 'next/image';

export default function UnsubscribeConfirmationPage() {
  return (

    <div className="flex flex-col items-center rounded-b-xl bg-secondary max-w-[calc(100svw-3rem)] 2xl:max-w-[90svw] mx-auto px-4 lg:px-12 py-12 gap-4 xl:gap-8 mb-12">
        <h1 className="text-4xl lg:text-4xl font-bold w-full xl:w-[80%] text-left lg:text-center mt-0 lg:mt-8">Unsubscribe Confirmation</h1>
        <p className="text-md lg:text-lg w-full xl:w-[60%] text-left lg:text-center">
            You have successfully unsubscribed from our newsletter.
            We're sorry to see you go. If you'd like to share why you unsubscribed, we'd love to hear your feedback.
        </p>
        <p className="text-md lg:text-lg w-full xl:w-[60%] text-left lg:text-center">
            If you change your mind, you can subscribe again anytime.
        </p>
        <Link href="/" className="bg-primary hover:bg-primary/80 text-white font-medium py-2 px-6 rounded-md transition duration-150">Back to Home</Link>
    </div>
  );
}
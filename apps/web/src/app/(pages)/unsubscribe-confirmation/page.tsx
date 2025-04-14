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

    
    // <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
    //   <div className="max-w-md w-full bg-gray-900 shadow-lg rounded-lg overflow-hidden border border-gray-800">
    //     <div className="pt-8 px-8 flex justify-center">
    //       <Image 
    //         src="/images/logo.png"
    //         alt="Best Branded Residences"
    //         width={180}
    //         height={60}
    //         className="h-auto"
    //       />
    //     </div>
        
    //     <div className="py-8 px-8">
    //       <h1 className="text-white text-3xl font-serif text-center mb-6 font-medium">
    //         Unsubscribe Confirmation
    //       </h1>
          
    //       <div className="text-gray-300 space-y-4 mb-8">
    //         <p>
    //           You have successfully unsubscribed from our newsletter.
    //         </p>
            
    //         <p>
    //           We're sorry to see you go. If you'd like to share why you unsubscribed, 
    //           we'd love to hear your feedback.
    //         </p>
    //       </div>
          
    //       <div className="text-center">
    //         <Link
    //           href="/"
    //           className="inline-block bg-amber-700 hover:bg-amber-800 text-white font-medium py-2 px-6 rounded-md transition duration-150"
    //         >
    //           Return to Home
    //         </Link>
    //       </div>
    //     </div>
        
    //     <div className="border-t border-gray-800 py-4 px-8 text-center text-gray-500 text-sm">
    //       © {new Date().getFullYear()} Best Branded Residences. All rights reserved.
    //     </div>
    //   </div>
    // </div>
  );
}
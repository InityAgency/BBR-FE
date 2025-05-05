"use client";

import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return(
    <div className="grid lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10 items-center">
          <div className="w-full min-h-[50svh] flex flex-col items-center justify-center">
              {children}
          </div>
        </div>
        <div className="relative hidden bg-muted lg:block m-6 rounded-xl overflow-hidden">
        <Image 
            src="/login.png"
            width={500}
            height={500}
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover"
        />
        </div>
    </div>
  );
}
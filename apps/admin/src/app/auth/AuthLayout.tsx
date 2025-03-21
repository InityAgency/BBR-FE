"use client"

import React from "react";
import { ReactNode } from "react";
import Image from 'next/image'


interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
            <Image
                src="/light-logo.svg"
                width={114}
                height={48}
                alt="Logo"
            />
        </div>
        <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
                {children}
            </div>
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
};

export default AuthLayout;

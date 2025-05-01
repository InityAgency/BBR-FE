"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, User } from "lucide-react"; // For the user icon
import { useState } from "react";

export default function MiniNav() {
    // Simulate login state (this would come from your auth system later)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // Simulated user data (this would come from backend)
    const simulatedUser = {
        name: "John Doe",
        avatarUrl: "https://github.com/shadcn.png" // Example avatar
    };

    // Toggle login state for simulation
    const handleLoginToggle = () => {
        setIsLoggedIn(!isLoggedIn);
    };

    return (
        <div className="max-w-[calc(100svw-1.5rem)] 2xl:max-w-[calc(100svw-4rem)] mx-auto px-4 py-2 justify-between items-center gap-6 hidden md:flex">
            <div className="flex flex-row gap-6">
                <Link href="mailto:support@bestbrandedresidence.com" className="flex gap-2 items-center hover:text-primary transition-all">
                    <Mail width={16} height={16} color="#B3804C"/>
                    support@bestbrandedresidence.com
                </Link>
                <Link href="tel:+1 223 664 5599" className="flex gap-2 items-center hover:text-primary transition-all">
                    <Phone width={16} height={16} color="#B3804C"/>
                    +1 223 664 5599
                </Link>
            </div>
            <div className="flex flex-row gap-6 items-center">
                <Link href="/" className="hover:text-primary transition-all">Schedule a demo</Link>
                <Link href="/" className="hover:text-primary transition-all">Developer features</Link>
                <Link href="/" className="hover:text-primary transition-all">Marketing solutions</Link>
                <div className="flex flex-col sm:flex-row gap-2">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src={simulatedUser.avatarUrl} alt={simulatedUser.name} />
                                <AvatarFallback>{simulatedUser.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-md font-medium">{simulatedUser.name}</span>
                            {/* Simulation button - remove later */}
                            <Button variant="ghost" size="sm" onClick={handleLoginToggle}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Button variant="secondary" asChild>
                                <Link href="/register">Join</Link>
                            </Button>
                            <Button variant="outline" className="flex items-center gap-1" onClick={handleLoginToggle}>
                                <User className="h-4 w-4" />
                                <span>Login</span>
                            </Button>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}
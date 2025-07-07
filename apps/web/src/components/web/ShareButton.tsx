"use client";

import { useState } from "react";
import { Share2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareModal } from "./Modals/ShareModal";

interface ShareButtonProps {
    url: string;
    title: string;
    description?: string;
    className?: string;
    // Dodatni propovi za bolje share experience
    imageUrl?: string;
    location?: string;
    price?: string;
    brand?: string;
}

export function ShareButton({ 
    url, 
    title, 
    description, 
    className,
    imageUrl,
    location,
    price,
    brand 
}: ShareButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShareClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <Button
                onClick={handleShareClick}
                variant="outline"
                className={`w-[36px] h-[36px] ${className || ""}`}
                title="Share"
            >
                <Share2Icon className="w-4 h-4" />
            </Button>
            
            <ShareModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                url={url}
                title={title}
                description={description}
                imageUrl={imageUrl}
                location={location}
                price={price}
                brand={brand}
            />
        </>
    );
}
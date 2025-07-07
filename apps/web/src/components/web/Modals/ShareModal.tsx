"use client";

import { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Copy, 
    Check, 
    Mail, 
} from "lucide-react";
import { toast } from "sonner";
import { FacebookIcon, TwitterIcon, LinkedInIcon, WhatsAppIcon } from "./BrandIcons";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
    description?: string;
    // Dodatni propovi za bolje formatiranje
    imageUrl?: string;
    location?: string;
    price?: string;
    brand?: string;
}

export function ShareModal({ 
    isOpen, 
    onClose, 
    url, 
    title, 
    description,
    imageUrl,
    location,
    price,
    brand 
}: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);

    const handleCopyLink = async () => {
        setLoading('copy');
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            toast.error("Failed to copy link");
        } finally {
            setLoading(null);
        }
    };

    // Funkcija za kreiranje custom text-a za različite platforme
    const getCustomText = (platform: string): string => {
        const baseText = `${title}`;
        const locationText = location ? ` in ${location}` : '';
        const brandText = brand ? ` by ${brand}` : '';
        const priceText = price ? ` | Starting from ${price}` : '';
        
        switch (platform) {
            case 'facebook':
                return `🏢 ${baseText}${locationText}${brandText}${priceText}\n\n${description || ''}\n\nDiscover luxury living at its finest! ✨`;
                
            case 'twitter':
                // Twitter ima ograničenje karaktera, pa skrati tekst
                const shortDescription = description ? description.slice(0, 100) + '...' : '';
                return `🏢 ${baseText}${locationText}${brandText}\n\n${shortDescription}\n\n#LuxuryLiving #RealEstate #BrandedResidences`;
                
            case 'linkedin':
                return `🏢 Exciting Opportunity: ${baseText}${locationText}${brandText}\n\n${description || ''}\n\n${priceText ? priceText + '\n\n' : ''}This luxury residence offers an exceptional investment opportunity in the premium real estate market.\n\n#RealEstate #Investment #LuxuryProperty`;
                
            case 'whatsapp':
                return `🏢 *${baseText}*${locationText}${brandText}\n\n${description || ''}\n\n${priceText ? priceText + '\n\n' : ''}Check it out! 👆`;
                
            case 'email':
                return `${baseText}${locationText}${brandText}`;
                
            default:
                return `${baseText}${locationText}${brandText}`;
        }
    };

    const getEmailBody = (): string => {
        let emailBody = `I wanted to share this amazing luxury residence with you:\n\n`;
        emailBody += `🏢 ${title}\n`;
        if (location) emailBody += `📍 ${location}\n`;
        if (brand) emailBody += `🏛️ ${brand}\n`;
        if (price) emailBody += `💰 ${price}\n`;
        emailBody += `\n${description || ''}\n\n`;
        emailBody += `Take a look at the full details here:\n${url}\n\n`;
        emailBody += `Best regards!`;
        
        return emailBody;
    };

    const handleShare = async (platform: string) => {
        setLoading(platform);
        try {
            const encodedUrl = encodeURIComponent(url);
            let shareUrl = '';
            
            switch (platform) {
                case 'facebook':
                    // Facebook će automatski uzeti Open Graph meta tagove
                    // Ali možemo dodati hash tagove kroz URL
                    const fbText = encodeURIComponent(getCustomText('facebook'));
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${fbText}`;
                    break;
                    
                case 'twitter':
                    const twitterText = encodeURIComponent(getCustomText('twitter'));
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${twitterText}`;
                    break;
                    
                case 'linkedin':
                    const linkedinText = encodeURIComponent(getCustomText('linkedin'));
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${linkedinText}`;
                    break;
                    
                case 'email':
                    const emailSubject = encodeURIComponent(getCustomText('email'));
                    const emailBody = encodeURIComponent(getEmailBody());
                    shareUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;
                    break;
                    
                case 'whatsapp':
                    const whatsappText = encodeURIComponent(`${getCustomText('whatsapp')}\n\n${url}`);
                    shareUrl = `https://wa.me/?text=${whatsappText}`;
                    break;
                    
                default:
                    return;
            }
            
            // Otvori u novom prozoru/tabu
            const windowFeatures = platform === 'email' ? '' : 'width=600,height=400,scrollbars=yes,resizable=yes';
            window.open(shareUrl, '_blank', windowFeatures);
            
            // Zatvori modal nakon kratke pauze
            setTimeout(() => {
                onClose();
            }, 500);
            
        } catch (error) {
            console.error('Error sharing:', error);
            toast.error("Failed to share");
        } finally {
            setLoading(null);
        }
    };

    const shareOptions = [
        {
            name: 'Facebook',
            icon: FacebookIcon,
            color: 'bg-[#1877F3] hover:bg-[#145db2] text-white',
            onClick: () => handleShare('facebook')
        },
        {
            name: 'Twitter',
            icon: TwitterIcon,
            color: 'bg-[#1DA1F2] hover:bg-[#0d8ddb] text-white',
            onClick: () => handleShare('twitter')
        },
        {
            name: 'LinkedIn',
            icon: LinkedInIcon,
            color: 'bg-[#0A66C2] hover:bg-[#084a8c] text-white',
            onClick: () => handleShare('linkedin')
        },
        {
            name: 'WhatsApp',
            icon: WhatsAppIcon,
            color: 'bg-[#25D366] hover:bg-[#1da851] text-white',
            onClick: () => handleShare('whatsapp')
        },
        {
            name: 'Email',
            icon: Mail,
            color: 'bg-[#6B7280] hover:bg-[#4b5563] text-white',
            onClick: () => handleShare('email')
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Share this residence</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {/* Preview card */}
                    {(imageUrl || title || description) && (
                        <div className="border rounded-lg p-4 bg-muted/30">
                            <div className="flex gap-3">
                                {imageUrl && (
                                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                        <img 
                                            src={imageUrl} 
                                            alt={title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
                                    {location && (
                                        <p className="text-xs text-muted-foreground mt-1">{location}</p>
                                    )}
                                    {description && (
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {description.slice(0, 100)}...
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Link kopiranje */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Copy link</label>
                        <div className="flex gap-2">
                            <Input
                                value={url}
                                readOnly
                                className="flex-1"
                            />
                            <Button
                                onClick={handleCopyLink}
                                disabled={loading === 'copy'}
                                variant="outline"
                                size="sm"
                                className="shrink-0"
                            >
                                {loading === 'copy' ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                ) : copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Društvene mreže */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Share on social media</label>
                        <div className="grid grid-cols-2 gap-3">
                            {shareOptions.map((option) => (
                                <Button
                                    key={option.name}
                                    onClick={option.onClick}
                                    disabled={loading === option.name.toLowerCase()}
                                    variant="outline"
                                    size="sm"
                                    className={`flex items-center gap-2 h-auto py-3 hover:scale-[1.02] transition-all duration-200 hover:shadow-md ${option.color} border-0`}
                                >
                                    {loading === option.name.toLowerCase() ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <option.icon className="h-4 w-4" />
                                    )}
                                    <span className="text-sm font-medium">{option.name}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
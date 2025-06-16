"use client";
import { useEffect, useState, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Image from "next/image";

interface Residence {
    id: string;
    name: string;
    totalScores: {
        totalScore: number;
        position: number;
        rankingCategory: {
            id: string;
            name: string;
            slug: string;
            title: string;
            description: string;
            featuredImage: any;
        };
    }[];
}

export default function DeveloperMarketingCollateral() {
    const [residences, setResidences] = useState<Residence[]>([]);
    const [selectedResidence, setSelectedResidence] = useState<Residence | null>(null);
    const [loading, setLoading] = useState(true);
    const badgeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useEffect(() => {
        const fetchResidences = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/residences/me?limit=10&page=1`, {
                    credentials: "include",
                });
                const data = await response.json();
                setResidences(data.data);
            } catch (error) {
                console.error('Error fetching residences:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResidences();
    }, []);

    const handleResidenceChange = (residenceId: string) => {
        const residence = residences.find(r => r.id === residenceId);
        setSelectedResidence(residence || null);
    };

    const handleDownloadBadge = async (badgeId: string, badgeType: string, position: number, categoryName: string) => {
        const badgeElement = badgeRefs.current[badgeId];
        if (!badgeElement) return;

        try {
            const htmlToImage = await import("html-to-image");

            const dataUrl = await htmlToImage.toPng(badgeElement, {
                quality: 0.95,
                pixelRatio: 3,
                // Dodaj padding da se osiguraš da se sve zahvati
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'center center'
                },
                // Proširuj capture oblast
                width: badgeElement.offsetWidth + 20,
                height: badgeElement.offsetHeight + 20
            });

            const downloadLink = document.createElement('a');
            downloadLink.href = dataUrl;
            downloadLink.download = `${categoryName}-${badgeType}-Badge.png`;
            downloadLink.click();
        } catch (error) {
            console.error('Error generating badge:', error);
        }
    };

    const getBadgeBackgroundColor = (badgeType: string) => {
        switch (badgeType) {
            case 'Gold':
                return 'bg-[#B3804C]';
            case 'Silver':
                return 'bg-[#567676]';
            case 'Bronze':
                return 'bg-[#94462E]';
            default:
                return 'bg-[#29343D]';
        }
    };

    return (
        <div className="py-8">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-2xl font-semibold text-sans">Badges</h1>
                <p className="text-muted-foreground">
                    Find and download all your earned recognition badges below.
                </p>
            </div>

            <div className="mb-8 custom-form w-full">
                <Select onValueChange={handleResidenceChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a residence" />
                    </SelectTrigger>
                    <SelectContent>
                        {residences.map((residence) => (
                            <SelectItem key={residence.id} value={residence.id}>
                                {residence.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedResidence && (
                <>
                    {selectedResidence.totalScores.filter(score => score.position <= 10).length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {selectedResidence.totalScores
                                .filter(score => score.position <= 10)
                                .map((score) => {
                                const badgeType = score.position === 1 ? 'Gold' : score.position === 2 ? 'Silver' : score.position === 3 ? 'Bronze' : 'Clasic';
                                const badgeId = `${score.rankingCategory.id}-${badgeType}`;

                                return (
                                    <Card key={badgeId} className="p-4 bg-secondary border-none">
                                        <div className="flex flex-col items-center gap-4">
                                            {/* Povećaj container i dodaj padding */}
                                            <div
                                                ref={(el) => {
                                                    badgeRefs.current[badgeId] = el;
                                                }}
                                                className="relative w-60 h-60 bg-transparent p-4 flex items-center justify-center"
                                                style={{ 
                                                    minWidth: '240px', 
                                                    minHeight: '240px',
                                                    // Dodaj transparentni padding da se osiguraš da se sve zahvati
                                                    padding: '20px'
                                                }}
                                            >
                                                {/* Badge image container */}
                                                <div className="relative w-52 h-52">
                                                    <Image
                                                        src={`/badges/${badgeType}.svg`}
                                                        alt={`${score.rankingCategory.name} badge`}
                                                        width={300}
                                                        height={300}
                                                        className="object-contain w-full h-full"
                                                    />
                                                    {/* Text overlay - pozicioniraj relativan na badge, ne na container */}
                                                    <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-center ${getBadgeBackgroundColor(badgeType)} px-4 py-1 rounded-sm text-center h-[45px]`}
                                                        style={{ width: '200px' }} // Fiksna širina da se ne odseca
                                                    >
                                                        <span className="text-xs font-medium text-white">#{score.position} {score.rankingCategory.name}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <h3 className="font-semibold text-sans">{score.rankingCategory.name}</h3>
                                                <p className="text-muted-foreground text-sm">Position #{score.position}</p>
                                            </div>
                                            <Button
                                                onClick={() => handleDownloadBadge(
                                                    badgeId,
                                                    badgeType,
                                                    score.position,
                                                    score.rankingCategory.name
                                                )}
                                                className="w-full"
                                            >
                                                <Download className="h-4 w-4" />
                                                Download Badge
                                            </Button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-secondary rounded-lg p-4">
                            <p className="text-muted-foreground">No badges available for this residence.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
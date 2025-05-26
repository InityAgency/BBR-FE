'use client';
import { useState } from "react";
import Image from "next/image";

interface PropertyCard {
    id: string;
    title: string;
    location: string;
    description: string;
    image: string;
}

interface AiMatchmakingChatProps {
    showImage?: boolean;
    backgroundImage?: string;
    properties?: PropertyCard[];
}

const defaultProperties: PropertyCard[] = [
    {
        id: "1",
        title: "Bulgari Resort & Residences, Dubai",
        location: "Dubai",
        description: "The Bulgari Resort & Residences in Dubai is a luxury beachfront destination that combines...",
        image: "/property-1.jpg"
    },
    {
        id: "2",
        title: "Fendi Chateau Residences",
        location: "Miami",
        description: "Luxuriate in ocean-front opulence with unparalleled design along the...",
        image: "/property-2.jpg"
    },
    {
        id: "3",
        title: "The Residences at Mandarin Oriental",
        location: "New York",
        description: "Exceptional luxury living in the heart of Manhattan...",
        image: "/property-3.jpg"
    }
];

export default function AiMatchmakingChat({ 
    showImage = false, 
    backgroundImage,
    properties = defaultProperties 
}: AiMatchmakingChatProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [question, setQuestion] = useState<string>("");

    const steps = [
        {
            question: "Welcome! Let's find the perfect branded residence for you. I'll guide you through a few quick questions",
            type: "intro",
            options: ["Brands", "Price"]
        },
        {
            question: "What's your preferred location? and what place ?",
            type: "location",
            options: ["Thailand", "United Arab Emirates", "Japan", "France", "Australia", "More"]
        }
    ];

    const handleOptionClick = (option: string, type: string) => {
        if (type === "intro") {
            setSelectedBrand(option);
        } else if (type === "location") {
            setSelectedLocation(option);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Chat Interface */}
            <div className="w-full lg:w-1/2">
                <div className="bg-secondary rounded-2xl p-6 h-[600px] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                                <path d="M3 7v4a1 1 0 0 0 1 1h3"/>
                                <path d="M21 7v4a1 1 0 0 1-1 1h-3"/>
                                <path d="M5 12v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4"/>
                                <path d="M6 2h12l2 5H4l2-5z"/>
                            </svg>
                        </div>
                        <h2 className="text-white text-xl font-semibold">BEST BRANDED RESIDENCES</h2>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 space-y-4 overflow-y-auto">
                        {steps.map((step, index) => (
                            <div key={index} className={`${index <= currentStep ? 'block' : 'hidden'}`}>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                                            <path d="M3 7v4a1 1 0 0 0 1 1h3"/>
                                            <path d="M21 7v4a1 1 0 0 1-1 1h-3"/>
                                            <path d="M5 12v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4"/>
                                            <path d="M6 2h12l2 5H4l2-5z"/>
                                        </svg>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[90%]">
                                        <p className="text-white text-sm">{step.question}</p>
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="ml-13 mt-3 space-y-2">
                                    {step.type === "intro" && (
                                        <div className="flex gap-2">
                                            {step.options.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        handleOptionClick(option, step.type);
                                                        setCurrentStep(1);
                                                    }}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                        option === "Price" 
                                                            ? "bg-primary text-white" 
                                                            : "bg-white/5 text-white/50 hover:bg-white/10"
                                                    }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {step.type === "location" && currentStep === 1 && (
                                        <div className="grid grid-cols-2 gap-2">
                                            {step.options.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => handleOptionClick(option, step.type)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                                                        selectedLocation === option
                                                            ? "bg-primary text-white"
                                                            : "bg-white/5 text-white/50 hover:bg-white/10"
                                                    }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="mt-4">
                        <div className="flex items-center gap-2 bg-gray-600 rounded-lg p-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary flex-shrink-0">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Ask AI a question or make a request..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="flex-1 bg-transparent text-white placeholder-gray-300 text-sm outline-none"
                            />
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                    <line x1="12" x2="12" y1="19" y2="22"/>
                                    <line x1="8" x2="16" y1="22" y2="22"/>
                                </svg>
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 12l6-6m0 0l6 6m-6-6v12"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Panel */}
            <div className="w-full lg:w-1/2">
                {showImage && backgroundImage ? (
                    <div className="h-[600px] relative rounded-2xl overflow-hidden">
                        <Image
                            src={backgroundImage}
                            alt="AI Matchmaking Background"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                ) : (
                    <div className="text-whiterounded-2xl p-2 border rounded-lg h-[600px] overflow-y-auto">
                        <div className="space-y-4">
                            {properties.map((property) => (
                                <div key={property.id} className="bg-secondary rounded-xl p-4 border border-white/10">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={property.image}
                                                alt={property.title}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-white mb-1">{property.title}</h4>
                                            <p className="text-sm text-white/50 mb-2">{property.location}</p>
                                            <p className="text-xs text-white/50">{property.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FavoriteHeartProps {
    entityId: string;
    entityType: string;
    isFavorite?: boolean;
    className?: string;
    onFavoriteRemoved?: () => void;
}

interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}

export function FavoriteHeart({ entityId, entityType, isFavorite = false, className, onFavoriteRemoved }: FavoriteHeartProps) {
    const [isFavorited, setIsFavorited] = useState(isFavorite);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.preventDefault(); // Sprečavamo propagaciju događaja
        e.stopPropagation();

        if (!user) {
            toast.error("You need to be logged in to add to favorites");
            router.push('/login');
            return;
        }

        try {
            setIsLoading(true);
            if (isFavorited) {
                // Uklanjamo iz favorita
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/favorites/${entityType}/${entityId}`,
                    {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to remove from favorites');
                }

                toast.success("Successfully removed from favorites");
                // Pozivamo callback ako postoji
                onFavoriteRemoved?.();
            } else {
                // Dodajemo u favorite
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/favorites`,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            entityType,
                            entityId,
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to add to favorites');
                }

                toast.success("Successfully added to favorites");
            }

            setIsFavorited(!isFavorited);
        } catch (error) {
            console.error('Error toggling favorite:', error);
            
            // Pokušavamo da parsujemo grešku iz backenda
            let errorMessage = "An error occurred. Please try again.";
            
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null) {
                const apiError = error as ApiError;
                if (apiError.message) {
                    errorMessage = apiError.message;
                }
            }

            // Prikazujemo odgovarajuću poruku greške
            if (errorMessage.includes("already exists")) {
                toast.error("This item is already in your favorites");
            } else if (errorMessage.includes("not found")) {
                toast.error("Item not found in favorites");
            } else if (errorMessage.includes("unauthorized") || errorMessage.includes("forbidden")) {
                toast.error("You don't have permission to perform this action");
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            id="favorite-heart"
            className={cn(
                "absolute top-3 right-3 z-10 p-2 rounded-full transition-all z-10",
                (isFavorited || isFavorite) 
                    ? "bg-secondary/80 hover:bg-secondary" 
                    : "bg-secondary/80 hover:bg-secondary",
                className
            )}
        >
            <Heart
                className={cn(
                    "w-5 h-5 transition-all",
                    (isFavorited || isFavorite) 
                        ? "fill-primary text-primary" 
                        : "text-white"
                )}
            />
        </button>
    );
} 
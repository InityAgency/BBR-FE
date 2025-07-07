"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
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

export function FavoriteButton({ entityId, entityType, isFavorite = false, className, onFavoriteRemoved }: FavoriteButtonProps) {
    const [isFavorited, setIsFavorited] = useState(isFavorite);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        setIsFavorited(isFavorite);
    }, [isFavorite]);

    const handleFavoriteClick = async () => {
        if (!user) {
            toast.error("You need to be logged in to add to favorites");
            router.push('/login');
            return;
        }

        try {
            setIsLoading(true);
            if (isFavorited) {
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
                onFavoriteRemoved?.();
            } else {
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
            let errorMessage = "An error occurred. Please try again.";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null) {
                const apiError = error as ApiError;
                if (apiError.message) {
                    errorMessage = apiError.message;
                }
            }
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
        <Button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            variant="outline"
            className={cn("w-[36px] h-[36px] transition-all", className)}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
            <Heart
                className={cn(
                    "w-4 h-4 transition-all",
                    isFavorited ? "fill-primary text-primary" : "text-foreground"
                )}
            />
        </Button>
    );
} 
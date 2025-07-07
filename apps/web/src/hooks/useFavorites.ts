import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useFavorites(entityId: string, entityType: string) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (!user || !entityId) {
                setIsFavorite(false);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/favorites/check/${entityType}/${entityId}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setIsFavorite(data.isFavorite || false);
                } else {
                    setIsFavorite(false);
                }
            } catch (error) {
                console.error('Error checking favorite status:', error);
                setIsFavorite(false);
            } finally {
                setLoading(false);
            }
        };

        checkFavoriteStatus();
    }, [entityId, entityType, user]);

    return { isFavorite, loading };
} 
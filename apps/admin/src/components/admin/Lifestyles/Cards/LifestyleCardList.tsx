import { Lifestyle } from "@/app/types/models/Lifestyles";
import { LifestyleCard } from "./LifestyleCard";

interface LifestyleCardListProps {
    lifestyles: Lifestyle[];
    onDelete: (page: number) => Promise<void>;
    currentPage: number;
}

export function LifestyleCardList({ lifestyles, onDelete, currentPage }: LifestyleCardListProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
            {lifestyles.map((lifestyle) => (
                <LifestyleCard 
                    key={lifestyle.id} 
                    lifestyle={lifestyle} 
                    onDelete={onDelete}
                    currentPage={currentPage}
                />
            ))}
        </div>
    );
}
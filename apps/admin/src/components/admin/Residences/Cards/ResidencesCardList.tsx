import { Residence } from "@/app/types/models/Residence";
import { ResidenceCard } from "./ResidenceCard";

interface ResidencesCardListProps {
  residences: Residence[];
}

export const ResidencesCardList: React.FC<ResidencesCardListProps> = ({ residences }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {residences.map((residence) => (
        <ResidenceCard key={residence.id} residence={residence} />
      ))}
    </div>
  );
};
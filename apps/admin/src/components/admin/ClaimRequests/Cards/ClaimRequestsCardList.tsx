import { ClaimRequest } from "@/app/types/models/ClaimRequest";
import { ClaimRequestCard } from "./ClaimRequestCard";

interface ClaimRequestsCardListProps {
  requests: ClaimRequest[];
  onUpdate: (page: number) => Promise<void>;
  currentPage: number;
}

export function ClaimRequestsCardList({ requests, onUpdate, currentPage }: ClaimRequestsCardListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
      {requests.map((request) => (
        <ClaimRequestCard 
          key={request.id} 
          request={request} 
          onUpdate={onUpdate}
          currentPage={currentPage}
        />
      ))}
    </div>
  );
} 
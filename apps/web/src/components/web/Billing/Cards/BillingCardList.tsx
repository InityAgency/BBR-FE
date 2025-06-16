import { BillingTransaction } from "@/types/billing";
import { BillingCard } from "./BillingCard";

interface BillingCardListProps {
  transactions: BillingTransaction[];
}

export function BillingCardList({ transactions }: BillingCardListProps) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <BillingCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
} 
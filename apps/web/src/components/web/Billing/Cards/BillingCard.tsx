import { BillingTransaction } from "@/types/billing";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BillingCardProps {
  transaction: BillingTransaction;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-900/55 text-green-300";
    case "pending":
      return "bg-yellow-900/55 text-yellow-300";
    case "failed":
      return "bg-red-900/55 text-red-300";
    default:
      return "bg-gray-900/55 text-gray-300";
  }
};

export function BillingCard({ transaction }: BillingCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="font-medium text-lg">
          {`${transaction.amount} ${transaction.currency.toUpperCase()}`}
        </div>
        <Badge 
          variant="secondary"
          className={`${getStatusColor(transaction.status)} transition-colors`}
        >
          {transaction.status.toUpperCase()}
        </Badge>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {transaction.type}
      </div>
      
      <div className="text-sm text-muted-foreground">
        {format(new Date(transaction.createdAt), "dd.MM.yyyy. HH:mm")}
      </div>

      {transaction.stripeHostingInvoiceUrl && (
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full"
          onClick={() => window.open(transaction.stripeHostingInvoiceUrl!, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Invoice
        </Button>
      )}
    </div>
  );
} 
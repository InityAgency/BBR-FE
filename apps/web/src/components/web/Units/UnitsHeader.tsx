import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UnitsHeaderProps {
  totalUnits?: number;
  residenceId?: string;
  residenceSlug?: string;
}

export function UnitsHeader({ totalUnits = 0, residenceId, residenceSlug }: UnitsHeaderProps) {
  const handleAddUnit = () => {
    if (residenceId) {
      window.location.href = `/developer/residences/${residenceSlug}/units/create`;
    } else {
      // Fallback ako nema residenceId
      console.warn("No residenceId provided for unit creation");
    }
  };

  return (
    <div className="flex items-center justify-between w-full mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-sans">Units</h1>
        <Badge 
          variant="outline" 
          className="px-2 py-1 text-sm"
        >
          {totalUnits} total
        </Badge>
      </div>
      <Button onClick={handleAddUnit} disabled={false}>
        <Plus className="h-4 w-4 mr-2" />
        Add Unit
      </Button>
    </div>
  );
}
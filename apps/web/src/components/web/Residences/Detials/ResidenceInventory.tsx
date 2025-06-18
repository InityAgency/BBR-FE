import { UnitsHeader } from "@/components/web/Units/UnitsHeader";
import { UnitsList } from "@/components/web/Units/UnitsList";
import { useState } from "react";

interface ResidenceInventoryProps {
  residenceId: string;
  residenceSlug: string;
}

export function ResidenceInventory({ residenceId, residenceSlug }: ResidenceInventoryProps) {
  const [totalUnits, setTotalUnits] = useState(0);

  return (
    <div className="space-y-6">
      <UnitsHeader totalUnits={totalUnits} residenceId={residenceId} residenceSlug={residenceSlug} />
      <UnitsList 
        residenceId={residenceId} 
        onTotalUnitsChange={setTotalUnits}
        residenceSlug={residenceSlug}
      />
    </div>
  );
}
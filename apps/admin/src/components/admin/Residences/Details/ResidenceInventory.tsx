import { UnitsHeader } from "../Units/UnitsHeader";
import { UnitsList } from "../Units/UnitsList";
import { useState } from "react";

interface ResidenceInventoryProps {
  residenceId: string;
}

export function ResidenceInventory({ residenceId }: ResidenceInventoryProps) {
  const [totalUnits, setTotalUnits] = useState(0);

  return (
    <div className="space-y-6">
      <UnitsHeader totalUnits={totalUnits} residenceId={residenceId} />
      <UnitsList 
        residenceId={residenceId} 
        onTotalUnitsChange={setTotalUnits}
      />
    </div>
  );
}
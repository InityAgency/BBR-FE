import { FilterFn } from "@tanstack/react-table";

// Funkcija za globalno pretraživanje preko više polja
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const searchValue = String(value).toLowerCase();
  
  // Pretražujemo ova polja
  const nameValue = String(row.getValue("name") || "").toLowerCase();
  const locationValue = String(row.getValue("location") || "").toLowerCase();
  const developerValue = String(row.getValue("developer") || "").toLowerCase();
  
  return nameValue.includes(searchValue) || 
         locationValue.includes(searchValue) || 
         developerValue.includes(searchValue);
};

// Filter za više izabranih vrednosti (multi-select)
export const multiSelectFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const values = filterValue as string[];
  if (!values || values.length === 0) return true;
  
  const rowValue = row.getValue(columnId) as string;
  
  // Proveravamo da li je vrednost u redu uključena u niz izabranih vrednosti
  // Ovo je OR logika (selektovan je bilo koji od izabranih filtera)
  return values.includes(rowValue);
};
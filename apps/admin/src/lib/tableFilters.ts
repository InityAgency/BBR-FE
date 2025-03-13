import { FilterFn } from "@tanstack/react-table";

// Univerzalna funkcija za globalno pretraživanje preko više polja
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const searchValue = String(value).toLowerCase();
  
  // Umesto da pretpostavljamo koja polja postoje, tražimo kroz sva dostupna polja
  const allColumns = row.getAllCells().map(cell => cell.column.id);
  
  // Proveri da li bilo koje polje (koje nije redni broj ili ID selekcije) sadrži traženi tekst
  return allColumns.some(id => {
    // Preskoči polje "select" i kolone koje ne sadrže tekst
    if (id === "select") return false;
    
    try {
      const cellValue = row.getValue(id);
      // Ako je vrednost undefined ili null, preskoči
      if (cellValue === undefined || cellValue === null) return false;
      // Ako je vrednost primitivnog tipa (string, number), pretvori je u string i pretraži
      return String(cellValue).toLowerCase().includes(searchValue);
    } catch (e) {
      // U slučaju greške (npr. kolona ne postoji), preskoči
      return false;
    }
  });
};

// Filter za više izabranih vrednosti (multi-select)
export const multiSelectFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const values = filterValue as string[];
  if (!values || values.length === 0) return true;
  
  try {
    const rowValue = row.getValue(columnId) as string;
    // Proveravamo da li je vrednost u redu uključena u niz izabranih vrednosti
    // Ovo je OR logika (selektovan je bilo koji od izabranih filtera)
    return values.includes(rowValue);
  } catch (e) {
    // Ako kolona ne postoji, vrati false
    return false;
  }
};
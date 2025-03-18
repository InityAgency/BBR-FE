import { FilterFn, FilterMeta } from "@tanstack/react-table";

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

// Prošireni filter meta interfejs za ugneždena polja
interface NestedFilterMeta extends FilterMeta {
  nestedField?: string;
}

// Filter za ugneždena polja (nested fields) kao što je role.name
export const nestedFieldFilter: FilterFn<any> = (row, columnId, filterValue, addMeta) => {
  const values = filterValue as string[];
  if (!values || values.length === 0) return true;
  
  try {
    const rowValue = row.getValue(columnId);
    
    // Ako je vrednost primitivnog tipa
    if (typeof rowValue === 'string') {
      return values.includes(rowValue);
    }
    
    // Ako je vrednost objekat (npr. { name: 'admin' })
    if (rowValue && typeof rowValue === 'object') {
      // Definisanje ugneždenog polja koje treba koristiti za filtriranje
      const meta = addMeta as unknown as NestedFilterMeta;
      const nestedField = meta?.nestedField || 'name';
      
      // Safe access to property using indexing with string
      if (nestedField in rowValue) {
        const nestedValue = rowValue[nestedField as keyof typeof rowValue];
        return typeof nestedValue === 'string' && values.includes(nestedValue);
      }
    }
    
    return false;
  } catch (e) {
    // Ako kolona ne postoji, vrati false
    return false;
  }
};
/**
 * Formatira datum i vreme u čitljiv oblik
 * @param dateTime string - ISO string datuma i vremena
 * @returns string - formatirani datum i vreme
 */
export function formatDateTime(dateTime: string | Date | undefined): string {
  if (!dateTime) return "-";
  
  const date = typeof dateTime === "string" ? new Date(dateTime) : dateTime;
  
  if (isNaN(date.getTime())) return "-";
  
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  
  return `${formattedDate}, ${formattedTime}`;
}

/**
 * Formatira samo datum u čitljiv oblik
 * @param date string - ISO string datuma
 * @returns string - formatirani datum
 */
export function formatDate(date: string | Date | undefined): string {
  if (!date) return "-";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return "-";
  
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
} 
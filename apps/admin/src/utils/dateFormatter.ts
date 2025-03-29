/**
 * Format a date string into a human-readable format
 * @param dateString An ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error, dateString);
    return "-";
  }
}

/**
 * Format a date string with time into a human-readable format
 * @param dateString An ISO date string
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date and time:", error, dateString);
    return "-";
  }
}

/**
 * Format a date string into a relative format (e.g., "2 days ago")
 * @param dateString An ISO date string
 * @returns Relative time string
 */
export function formatRelativeDate(dateString: string | undefined): string {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  } catch (error) {
    console.error("Error formatting relative date:", error, dateString);
    return "-";
  }
}
import { format, parseISO } from 'date-fns';
import { sr } from 'date-fns/locale';

/**
 * Formatira ISO datum string u čitljiv format
 * 
 * @param dateString ISO datum string (npr. "2025-03-22T18:09:47.813Z")
 * @param formatStr Format za prikaz (opciono)
 * @returns Formatiran datum
 */
export function formatDate(dateString: string, formatStr: string = 'dd.MM.yyyy.'): string {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr, { locale: sr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Formatira ISO datum string sa vremenom
 * 
 * @param dateString ISO datum string
 * @returns Formatiran datum sa vremenom
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd.MM.yyyy. HH:mm', { locale: sr });
  } catch (error) {
    console.error('Error formatting date with time:', error);
    return dateString;
  }
}

/**
 * Formatira ISO datum string u relativni format (npr. "pre 2 dana")
 * 
 * @param dateString ISO datum string
 * @returns Relativan datum
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    
    // Razlika u danima
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return 'danas';
    if (diff === 1) return 'juče';
    if (diff < 7) return `pre ${diff} dana`;
    
    return format(date, 'dd.MM.yyyy.', { locale: sr });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return dateString;
  }
} 
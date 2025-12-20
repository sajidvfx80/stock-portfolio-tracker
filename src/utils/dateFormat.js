import { format, parseISO } from 'date-fns';

/**
 * Format date to DD/MM/YY format
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date as DD/MM/YY
 */
export const formatDateDDMMYY = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd/MM/yy');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date to DD/MM/YY for chart labels (shorter format)
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date as DD/MM/YY
 */
export const formatDateForChart = (date) => {
  return formatDateDDMMYY(date);
};


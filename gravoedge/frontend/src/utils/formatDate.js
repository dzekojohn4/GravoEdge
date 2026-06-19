/**
 * Format a timestamp into a human-readable date-time string.
 *
 * @param {number|string|Date} timestamp - The timestamp to format
 * @returns {string} Formatted date string in DD/MM/YY - HH:MM AM/PM format
 */
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
    .format(date)
    .replace(',', ' -');
}

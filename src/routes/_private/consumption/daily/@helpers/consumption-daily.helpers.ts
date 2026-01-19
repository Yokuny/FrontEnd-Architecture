import { format } from 'date-fns';

/**
 * Downloads data as CSV file
 * @param data - Array of objects to export
 * @param filename - Name of the file (without extension)
 */
export function downloadCSV(data: Record<string, unknown>[], filename: string): void {
  if (!data.length) return;

  const allKeys = new Set<string>();
  for (const row of data) {
    for (const key of Object.keys(row)) {
      allKeys.add(key);
    }
  }
  const headers = Array.from(allKeys);
  const csvContent = [headers.join(','), ...data.map((row) => headers.map((header) => row[header] ?? '').join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${format(new Date(), 'yyyyMMddHHmmss')}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Updates time portion of a date string
 * @param oldDate - Original date string
 * @param newTime - New time in HH:mm format
 * @returns Updated ISO date string
 */
export function updateDateTime(oldDate: string, newTime: string): string {
  const dateObj = new Date(oldDate);
  const [hours, minutes] = newTime.split(':');

  dateObj.setHours(Number(hours), Number(minutes));

  return dateObj.toISOString();
}

/**
 * Sorts consumption data by date in descending order
 * @param data - Array of objects with date property
 * @returns Sorted array
 */
export function sortByDateDesc<T extends { date: string }>(data: T[]): T[] {
  return [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

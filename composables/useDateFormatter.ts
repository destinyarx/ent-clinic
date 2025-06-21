import { format } from 'date-fns';

export const useDateFormatter = () => {
  const formatDateTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;

        let formatted = format(d, "MMM'.' d, yyyy h:mm a");

        formatted = formatted.replace('AM', 'am').replace('PM', 'pm');

        return formatted;
  }

  const formatDate = (date: Date | string, dateFormat?: string) => {
    const rawDate = typeof date === 'string' ? new Date(date) : date;

    if (dateFormat) return format(rawDate, dateFormat)

    return format(rawDate, "MMM'.' d, yyyy");
  }


  return { formatDateTime, formatDate };
}


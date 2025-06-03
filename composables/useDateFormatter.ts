import { format } from 'date-fns';

export const useDateFormatter = () => {
  const formatDateTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;

        let formatted = format(d, "MMM'.' d, yyyy h:mm a");

        formatted = formatted.replace('AM', 'am').replace('PM', 'pm');

        return formatted;
  }


  return { formatDateTime };
}


import { isToday, isYesterday, differenceInCalendarDays, differenceInHours, differenceInMinutes, format } from 'date-fns'

export function formatDate(date: string|Date) {
  const targetDate = new Date(date)
  return format(targetDate, 'MMM. d, yyyy');
}

export function computeAge(birthDateString: string): number {
  const birthDate = new Date(birthDateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  // Check if the birthday has not occurred yet this year
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

export function describeDateGap(date: string|Date) {
  const targetDate = new Date(date)
  const diff = differenceInCalendarDays(new Date(), targetDate)

  if (isToday(date)) {
      return 'Today'
  }

  if (isYesterday(date)) {
      return 'Yesterday'
  }

  if (diff > 1 && diff <= 7) {
      return `Last ${diff} days`
  }

  return format(date, 'MMM. d, yyyy')
}

export function calculateDateTimeGap(start: string|Date, end: string|Date) {
  const startDate = new Date(start)
  const endDate = new Date(end)

  const day = differenceInCalendarDays(endDate, startDate)
  if (day > 1) return `${day} days`;

  const hours = differenceInHours(end, start);
  if (hours >= 1) return `${hours} hour${hours > 1 ? 's' : ''}`;

  const minutes = differenceInMinutes(end, start);
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}
  
import { isToday, isYesterday, differenceInCalendarDays, format } from 'date-fns'

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
  const diff = differenceInCalendarDays(new Date(), date)

  if (isToday(date)) {
      return 'Today'
  }

  if (isYesterday(date)) {
      return 'Yesterday'
  }

  if (diff > 1 && diff <= 5) {
      return `Last ${window} days`
  }

  return format(date, 'MMM. d, yyyy')
}
  
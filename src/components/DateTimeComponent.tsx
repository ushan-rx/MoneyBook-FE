import {
  parseISO,
  format,
  isToday,
  isYesterday,
  isSameISOWeek,
} from 'date-fns';

export default function DateTimeComponent({
  dateString,
  type,
}: {
  dateString: string;
  type: string;
}) {
  let formattedDate = '';
  try {
    const date = parseISO(dateString);
    if (type === 'dateTime') {
      formattedDate = format(date, 'Pp');
    } else if (type === 'time') {
      formattedDate = format(date, 'HH:mm');
    } else {
      //default way
      if (isToday(date)) {
        formattedDate = format(date, 'HH:mm');
      } else if (isYesterday(date)) {
        formattedDate = 'Yesterday';
      } else if (isSameISOWeek(date, new Date())) {
        formattedDate = format(date, 'EEEE');
      } else {
        formattedDate = format(date, 'dd/MM/yyyy');
      }
    }
  } catch (error) {
    console.error('Error parsing date', error);
  }

  return <time dateTime={dateString}>{formattedDate}</time>;
}

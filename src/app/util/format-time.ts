import * as dayjs from 'dayjs';

export function formatTime(time: string, format: string): string {
  return dayjs(time).format(format);
}

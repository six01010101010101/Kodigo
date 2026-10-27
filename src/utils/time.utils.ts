/**
 * Formats a timestamp into clean, human-readable Portuguese relative time
 * e.g., 'agora', 'há 1 minuto', 'há 5 minutos', 'há 1 hora'
 */
export function formatRelativeTime(dateOrTimestamp: number | Date | string): string {
  const time = typeof dateOrTimestamp === 'number'
    ? dateOrTimestamp
    : new Date(dateOrTimestamp).getTime();

  if (isNaN(time)) return 'agora';

  const diffSeconds = Math.floor((Date.now() - time) / 1000);

  if (diffSeconds < 45) {
    return 'agora';
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes === 1) {
    return 'há 1 minuto';
  }
  if (diffMinutes < 60) {
    return `há ${diffMinutes} minutos`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) {
    return 'há 1 hora';
  }
  if (diffHours < 24) {
    return `há ${diffHours} horas`;
  }

  return 'há mais de 1 dia';
}

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate?: Date;
}

function formatDate(date: Date): string {
  return date.toISOString().replace(/-|:|\.\d\d\d/g, '').replace('Z', '');
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const end = event.endDate || new Date(event.startDate.getTime() + 60 * 60 * 1000); // Default 1 hour
  
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', event.title);
  url.searchParams.append('details', event.description.replace(/<[^>]*>?/gm, '')); // Strip HTML for plain text
  url.searchParams.append('location', event.location);
  url.searchParams.append('dates', `${formatDate(event.startDate)}/${formatDate(end)}`);
  
  return url.toString();
}

export function generateIcsContent(event: CalendarEvent): string {
  const end = event.endDate || new Date(event.startDate.getTime() + 60 * 60 * 1000);
  const now = formatDate(new Date());
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KeyAstro//Website//EN
BEGIN:VEVENT
UID:${now}-${event.startDate.getTime()}@keyastro.pages.dev
DTSTAMP:${now}
DTSTART:${formatDate(event.startDate)}
DTEND:${formatDate(end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/<[^>]*>?/gm, '')}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
}

export function downloadIcsFile(event: CalendarEvent) {
  const content = generateIcsContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
/** Escape a CSV cell (RFC-style quotes). */
export function csvEscape(value: string | number | null | undefined): string {
  const s = value == null ? '' : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Build CSV text from headers + row arrays. */
export function toCsv(headers: string[], rows: Array<Array<string | number | null | undefined>>): string {
  const lines = [
    headers.map(csvEscape).join(','),
    ...rows.map((row) => row.map(csvEscape).join(',')),
  ];
  return lines.join('\n');
}

/** Trigger a browser download of a CSV file. */
export function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number | null | undefined>>) {
  const csv = toCsv(headers, rows);
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Inclusive local-day range check against an ISO timestamp. */
export function inDateRange(iso: string, from: string, to: string): boolean {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  if (from) {
    const start = new Date(`${from}T00:00:00`).getTime();
    if (t < start) return false;
  }
  if (to) {
    const end = new Date(`${to}T23:59:59.999`).getTime();
    if (t > end) return false;
  }
  return true;
}

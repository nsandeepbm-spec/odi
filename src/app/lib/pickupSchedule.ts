/** Pickup date/time helpers for admin Pickups UI. */

export type PickupSchedule = { date: string; time: string };

export function resolvePickupSchedule(order: {
  delhivery_pickup_date?: string | null;
  delhivery_pickup_time?: string | null;
  delhivery_raw?: Record<string, unknown> | null;
  pickupDate?: string | null;
  pickupTime?: string | null;
}): PickupSchedule | null {
  if (order.pickupDate?.trim()) {
    return { date: order.pickupDate.trim(), time: order.pickupTime?.trim() ?? '' };
  }
  const colDate = order.delhivery_pickup_date?.trim();
  if (colDate) {
    return { date: colDate, time: order.delhivery_pickup_time?.trim() ?? '' };
  }
  const raw = order.delhivery_raw;
  if (!raw) return null;
  const sched = raw.pickup_schedule as { date?: string; time?: string } | undefined;
  if (sched?.date?.trim()) {
    return { date: sched.date.trim(), time: sched.time?.trim() ?? '' };
  }
  const pickup = raw.pickup as Record<string, unknown> | undefined;
  if (pickup) {
    const date =
      (typeof pickup.pickup_date === 'string' && pickup.pickup_date.trim()) ||
      (typeof pickup.pickupDate === 'string' && pickup.pickupDate.trim()) ||
      '';
    if (date) {
      const time =
        (typeof pickup.pickup_time === 'string' && pickup.pickup_time.trim()) ||
        (typeof pickup.pickupTime === 'string' && pickup.pickupTime.trim()) ||
        '';
      return { date, time };
    }
  }
  return null;
}

export function formatPickupDateLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatPickupTimeLabel(time: string): string {
  const t = time.trim();
  if (!t) return '—';
  const [hStr, mStr = '00'] = t.split(':');
  const h = Number(hStr);
  if (!Number.isFinite(h)) return t.slice(0, 5);
  const hour12 = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${hour12}:${mStr.padStart(2, '0')} ${ampm}`;
}

export function formatPickupScheduleBlock(schedule: PickupSchedule | null): {
  dateLabel: string;
  timeLabel: string;
  hasSchedule: boolean;
} {
  if (!schedule?.date) {
    return { dateLabel: 'Not recorded', timeLabel: '—', hasSchedule: false };
  }
  return {
    dateLabel: formatPickupDateLabel(schedule.date),
    timeLabel: schedule.time ? formatPickupTimeLabel(schedule.time) : '—',
    hasSchedule: true,
  };
}

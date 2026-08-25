import React, { useMemo } from 'react';
import type { ShipmentTracking, UserOrderStatus } from '../../lib/api';
import {
  friendlyCourierStatus,
  resolveShipmentPhase,
  type ShipmentPhase,
} from '../../lib/shipmentStatus';

/** Minimal order shape shared by user + admin drawers. */
export type MilestoneOrder = {
  status: string;
  created_at: string;
  updated_at?: string | null;
  paid_at?: string | null;
  delhivery_waybill?: string | null;
  delhivery_status?: string | null;
};

type SubEvent = {
  id: string;
  text: string;
  detail?: string | null;
  time?: string | null;
};

type Milestone = {
  id: string;
  title: string;
  date: string | null;
  completed: boolean;
  current: boolean;
  events: SubEvent[];
};

function formatMilestoneDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });
}

function formatEventTime(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const date = d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });
  const time = d.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${date} - ${time}`;
}

function milestoneIndex(phase: ShipmentPhase): number {
  switch (phase) {
    case 'confirmed':
      return 0;
    case 'preparing':
    case 'ready_to_ship':
      return 1;
    case 'in_transit':
      return 1;
    case 'out_for_delivery':
      return 2;
    case 'delivered':
      return 3;
  }
}

function scanBucket(scan: string): 'confirmed' | 'shipped' | 'ofd' | 'delivered' {
  const s = scan.toLowerCase();
  if (s.includes('deliver') && !s.includes('out for')) return 'delivered';
  if (s.includes('out for')) return 'ofd';
  return 'shipped';
}

function asPhaseOrder(order: MilestoneOrder) {
  return {
    status: order.status as UserOrderStatus,
    delhivery_waybill: order.delhivery_waybill,
    delhivery_status: order.delhivery_status,
  };
}

/** Build Flipkart-style milestones from order + Delhivery tracking. */
export function buildShipmentMilestones(
  order: MilestoneOrder,
  tracking?: ShipmentTracking | null,
  deliveryAddress?: string | null,
  adminView = false,
): Milestone[] {
  const phase = resolveShipmentPhase(asPhaseOrder(order), tracking);
  const activeIdx = milestoneIndex(phase);
  const waybill = order.delhivery_waybill?.trim() || tracking?.waybill || null;
  const updatedAt = order.updated_at ?? order.paid_at ?? order.created_at;

  const confirmedEvents: SubEvent[] = [
    {
      id: 'placed',
      text: adminView ? 'Order has been placed' : 'Your order has been placed',
      time: order.created_at,
    },
  ];

  if (order.status !== 'paid' || order.paid_at) {
    confirmedEvents.push({
      id: 'paid',
      text: 'Payment received',
      time: order.paid_at ?? order.created_at,
    });
  }

  if (['processing', 'shipped', 'delivered'].includes(order.status) || phase !== 'confirmed') {
    confirmedEvents.push({
      id: 'processed',
      text: adminView ? 'Order processed for fulfillment' : 'Seller has processed your order',
      time: updatedAt,
    });
  }

  const shippedEvents: SubEvent[] = [];

  if (waybill) {
    shippedEvents.push({
      id: 'awb',
      text: `Delhivery · ${waybill}`,
      detail: tracking?.origin ? `From ${tracking.origin}` : null,
    });
  }

  const scansChrono = [...(tracking?.scans ?? [])].reverse();
  for (let i = 0; i < scansChrono.length; i++) {
    const scan = scansChrono[i];
    if (scanBucket(scan.scan) !== 'shipped') continue;
    shippedEvents.push({
      id: `scan-ship-${i}`,
      text: adminView ? scan.scan : friendlyCourierStatus(scan.scan),
      detail: scan.scannedLocation ?? scan.instructions,
      time: scan.scanDateTime,
    });
  }

  if (
    shippedEvents.length <= (waybill ? 1 : 0) &&
    tracking?.status &&
    scanBucket(tracking.status) === 'shipped'
  ) {
    shippedEvents.push({
      id: 'status-ship',
      text: adminView ? tracking.status : friendlyCourierStatus(tracking.status),
      detail: tracking.statusLocation ?? tracking.instructions,
      time: tracking.statusDateTime,
    });
  }

  if (shippedEvents.length === 0 && activeIdx >= 1) {
    if (phase === 'ready_to_ship' || phase === 'preparing') {
      shippedEvents.push({
        id: 'ready',
        text:
          phase === 'preparing'
            ? 'Packing at warehouse'
            : 'Getting ready to ship — waiting for courier pickup',
        time: updatedAt,
      });
    } else {
      shippedEvents.push({
        id: 'shipped-fallback',
        text: 'Shipment is on the way',
        time: updatedAt,
      });
    }
  }

  const ofdEvents: SubEvent[] = [];
  for (let i = 0; i < scansChrono.length; i++) {
    const scan = scansChrono[i];
    if (scanBucket(scan.scan) !== 'ofd') continue;
    ofdEvents.push({
      id: `scan-ofd-${i}`,
      text: 'Out for delivery',
      detail: scan.scannedLocation ?? scan.instructions,
      time: scan.scanDateTime,
    });
  }
  if (phase === 'out_for_delivery' && ofdEvents.length === 0) {
    ofdEvents.push({
      id: 'ofd-fallback',
      text: 'Out for delivery',
      detail: tracking?.statusLocation,
      time: tracking?.statusDateTime ?? updatedAt,
    });
  }

  const deliveredEvents: SubEvent[] = [];
  for (let i = 0; i < scansChrono.length; i++) {
    const scan = scansChrono[i];
    if (scanBucket(scan.scan) !== 'delivered') continue;
    deliveredEvents.push({
      id: `scan-del-${i}`,
      text: 'Delivered',
      detail: scan.scannedLocation ?? deliveryAddress,
      time: scan.scanDateTime,
    });
  }
  if (phase === 'delivered') {
    if (deliveredEvents.length === 0) {
      deliveredEvents.push({
        id: 'del-fallback',
        text: 'Delivered',
        detail: deliveryAddress,
        time: tracking?.deliveryDate ?? updatedAt,
      });
    }
  } else if (deliveryAddress) {
    deliveredEvents.push({
      id: 'dest-pending',
      text: adminView ? 'Delivery address' : 'Delivering to you',
      detail: deliveryAddress,
      time: null,
    });
  }

  return [
    {
      id: 'confirmed',
      title: 'Order Confirmed',
      date: formatMilestoneDate(order.created_at),
      completed: activeIdx > 0,
      current: activeIdx === 0,
      events: confirmedEvents,
    },
    {
      id: 'shipped',
      title:
        activeIdx === 1 && (phase === 'preparing' || phase === 'ready_to_ship')
          ? phase === 'preparing'
            ? 'Processing'
            : 'Ready to Ship'
          : 'Shipped',
      date: formatMilestoneDate(
        shippedEvents.find((e) => e.time)?.time ?? (activeIdx >= 1 ? updatedAt : null),
      ),
      completed: activeIdx > 1,
      current: activeIdx === 1,
      events: shippedEvents,
    },
    {
      id: 'ofd',
      title: 'Out For Delivery',
      date: formatMilestoneDate(ofdEvents.find((e) => e.time)?.time ?? null),
      completed: activeIdx > 2,
      current: activeIdx === 2,
      events: ofdEvents,
    },
    {
      id: 'delivered',
      title: 'Delivered',
      date: formatMilestoneDate(
        deliveredEvents.find((e) => e.time)?.time ??
          (phase === 'delivered' ? tracking?.deliveryDate ?? updatedAt : null),
      ),
      completed: activeIdx >= 3,
      current: activeIdx === 3,
      events: deliveredEvents,
    },
  ];
}

/** Flipkart-style vertical milestone timeline (user + admin drawers). */
export function ShipmentMilestoneTimeline({
  order,
  tracking,
  deliveryAddress,
  adminView = false,
}: {
  order: MilestoneOrder;
  tracking?: ShipmentTracking | null;
  deliveryAddress?: string | null;
  adminView?: boolean;
}) {
  const milestones = useMemo(
    () => buildShipmentMilestones(order, tracking, deliveryAddress, adminView),
    [order, tracking, deliveryAddress, adminView],
  );

  return (
    <ol className="relative">
      {milestones.map((m, idx) => {
        const isLast = idx === milestones.length - 1;
        const lineGreen = m.completed || m.current;
        const showEvents = m.completed || m.current || m.events.some((e) => e.time);

        return (
          <li key={m.id} className="relative pl-7 pb-7 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[7px] top-3 bottom-0 w-[2px] ${
                  m.completed ? 'bg-emerald-500' : lineGreen ? 'bg-emerald-500/40' : 'bg-neutral-700'
                }`}
              />
            )}
            <span
              className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 ${
                m.completed || m.current
                  ? 'bg-emerald-500 border-emerald-400'
                  : 'bg-[#0a0a0a] border-neutral-600'
              }`}
            />

            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 mb-2">
              <p
                className={`text-[15px] font-bold leading-tight ${
                  m.completed || m.current ? 'text-white' : 'text-neutral-500'
                }`}
              >
                {m.title}
              </p>
              {m.date && (
                <p className="text-[11px] text-neutral-500 shrink-0">{m.date}</p>
              )}
            </div>

            {showEvents && m.events.length > 0 && (
              <ul className="space-y-3 mt-1">
                {m.events.map((ev) => (
                  <li key={ev.id} className="min-w-0">
                    <p
                      className={`text-[13px] leading-snug ${
                        m.completed || m.current ? 'text-neutral-200' : 'text-neutral-500'
                      }`}
                    >
                      {ev.text}
                    </p>
                    {ev.detail && (
                      <p className="text-[12px] text-neutral-500 mt-0.5 leading-snug">{ev.detail}</p>
                    )}
                    {ev.time && (
                      <p className="text-[11px] text-neutral-600 mt-0.5">
                        {formatEventTime(ev.time)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}

import React from 'react';
import { MapPin } from 'lucide-react';
import type { ShipmentTracking, UserOrder } from '../../lib/api';
import {
  friendlyCourierStatus,
  friendlyRouteStepTitle,
  headlineShipmentStatus,
  resolveShipmentPhase,
  trackingIsDelivered,
  type ShipmentPhase,
} from '../../lib/shipmentStatus';
import type { RouteStep } from './RouteStepsList';
import { RouteStepsList } from './RouteStepsList';

function formatScanTime(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Apply green / cyan / white states from the unified shipment phase. */
function applyPhaseToRouteSteps(steps: RouteStep[], phase: ShipmentPhase): RouteStep[] {
  if (steps.length === 0) return steps;

  const destIdx = steps.findIndex((s) => s.id === 'destination');
  const destStep = destIdx >= 0 ? steps[destIdx] : null;
  const routeSteps = destIdx >= 0 ? steps.slice(0, destIdx) : [...steps];

  if (phase === 'delivered') {
    return steps.map((s) => ({ ...s, completed: true, current: false }));
  }

  const next = routeSteps.map((s) => ({ ...s, completed: false, current: false }));

  if (phase === 'confirmed') {
    if (next[0]) next[0] = { ...next[0], current: true };
  } else if (phase === 'preparing') {
    for (let i = 0; i < next.length - 1; i++) next[i] = { ...next[i], completed: true };
    const currentIdx = Math.max(0, next.length - 1);
    next[currentIdx] = { ...next[currentIdx], current: true };
  } else if (phase === 'ready_to_ship') {
    for (let i = 0; i < next.length - 1; i++) next[i] = { ...next[i], completed: true };
    const currentIdx = Math.max(0, next.length - 1);
    next[currentIdx] = { ...next[currentIdx], current: true };
  } else {
    const transitIdx = next.findLastIndex((s) =>
      /transit|on the way|dispatched|picked|out for delivery/i.test(s.title),
    );
    const currentIdx = transitIdx >= 0 ? transitIdx : Math.max(0, next.length - 1);
    for (let i = 0; i < currentIdx; i++) next[i] = { ...next[i], completed: true };
    next[currentIdx] = { ...next[currentIdx], current: true };
  }

  const result = [...next];
  if (destStep) result.push({ ...destStep, completed: false, current: false });
  return result;
}

/** Delhivery route — origin → scans/status → destination. */
export function buildRouteSteps(
  tracking: ShipmentTracking | null,
  userFacing?: boolean,
  deliveryAddress?: string | null,
  phase?: ShipmentPhase,
): RouteStep[] {
  if (!tracking) return [];

  const delivered = trackingIsDelivered(tracking);
  const scansChrono = [...(tracking.scans ?? [])].reverse();
  const hasCourierUpdate = scansChrono.length > 0 || Boolean(tracking.status?.trim());
  const steps: RouteStep[] = [];

  if (tracking.origin) {
    steps.push({
      id: 'origin',
      title: userFacing ? friendlyRouteStepTitle('origin', tracking.origin) : 'Origin',
      subtitle: tracking.origin,
      time: null,
      completed: hasCourierUpdate || delivered,
      current: !hasCourierUpdate && !delivered,
    });
  }

  scansChrono.forEach((scan, idx) => {
    const isLast = idx === scansChrono.length - 1;
    steps.push({
      id: `scan-${idx}-${scan.scanDateTime ?? scan.scan}`,
      title: userFacing ? friendlyRouteStepTitle('scan', scan.scan) : scan.scan,
      subtitle: scan.scannedLocation ?? scan.instructions,
      time: scan.scanDateTime,
      completed: delivered || !isLast,
      current: isLast && !delivered,
    });
  });

  if (scansChrono.length === 0 && tracking.status?.trim()) {
    steps.push({
      id: 'status-current',
      title: userFacing ? friendlyCourierStatus(tracking.status) : tracking.status,
      subtitle: tracking.statusLocation ?? tracking.instructions,
      time: tracking.statusDateTime,
      completed: delivered,
      current: !delivered,
    });
  }

  if (deliveryAddress || tracking.destination) {
    steps.push({
      id: 'destination',
      title: userFacing
        ? friendlyRouteStepTitle(
            'destination',
            tracking.destination ?? deliveryAddress ?? '',
            delivered,
          )
        : delivered
          ? 'Delivered'
          : 'Destination',
      subtitle: deliveryAddress ?? tracking.destination ?? null,
      time: tracking.deliveryDate ?? (delivered ? tracking.statusDateTime : null),
      completed: delivered,
      current: false,
    });
  }

  if (phase) return applyPhaseToRouteSteps(steps, phase);
  return steps;
}

/** Fallback when Delhivery tracking is not loaded yet. */
export function buildPreTrackingRouteSteps(
  order: Pick<UserOrder, 'status' | 'created_at' | 'updated_at' | 'delhivery_waybill' | 'delhivery_status'>,
  deliveryAddress?: string | null,
  phase?: ShipmentPhase,
): RouteStep[] {
  const resolvedPhase = phase ?? resolveShipmentPhase(order, null);
  const delivered = resolvedPhase === 'delivered';

  if (resolvedPhase === 'delivered' || resolvedPhase === 'in_transit' || resolvedPhase === 'out_for_delivery') {
    const steps: RouteStep[] = [
      {
        id: 'shipped-from',
        title: 'Shipped from',
        subtitle: 'Left our warehouse',
        time: order.updated_at,
        completed: true,
        current: false,
      },
      {
        id: 'in-transit',
        title: resolvedPhase === 'out_for_delivery' ? 'Out for delivery' : 'On the way',
        subtitle: 'Your parcel is heading to you',
        time: order.updated_at,
        completed: delivered,
        current: !delivered,
      },
      {
        id: 'destination',
        title: delivered ? 'Delivered to you' : 'Delivering to you',
        subtitle: deliveryAddress ?? null,
        time: delivered ? (order.updated_at ?? order.created_at) : null,
        completed: delivered,
        current: false,
      },
    ];
    return applyPhaseToRouteSteps(steps, resolvedPhase);
  }

  if (resolvedPhase === 'ready_to_ship') {
    const steps: RouteStep[] = [
      {
        id: 'shipped-from',
        title: 'Shipped from',
        subtitle: 'At our warehouse',
        time: order.updated_at,
        completed: true,
        current: false,
      },
      {
        id: 'ready',
        title: order.delhivery_status
          ? friendlyCourierStatus(order.delhivery_status)
          : 'Getting ready to ship',
        subtitle: 'Waiting for courier pickup',
        time: order.updated_at,
        completed: false,
        current: true,
      },
      {
        id: 'destination',
        title: 'Delivering to you',
        subtitle: deliveryAddress ?? null,
        time: null,
        completed: false,
        current: false,
      },
    ];
    return applyPhaseToRouteSteps(steps, resolvedPhase);
  }

  if (resolvedPhase === 'preparing') {
    const steps: RouteStep[] = [
      {
        id: 'confirmed',
        title: 'Order confirmed',
        subtitle: 'Payment received — thank you for your order',
        time: order.created_at,
        completed: true,
        current: false,
      },
      {
        id: 'processing',
        title: 'Preparing your order',
        subtitle: 'We are packing your book at our warehouse',
        time: order.updated_at,
        completed: false,
        current: true,
      },
      {
        id: 'destination',
        title: 'Delivering to you',
        subtitle: deliveryAddress ?? null,
        time: null,
        completed: false,
        current: false,
      },
    ];
    return applyPhaseToRouteSteps(steps, resolvedPhase);
  }

  const steps: RouteStep[] = [
    {
      id: 'confirmed',
      title: 'Order confirmed',
      subtitle: 'Payment received — thank you for your order',
      time: order.created_at,
      completed: false,
      current: true,
    },
    {
      id: 'processing',
      title: 'Preparing your order',
      subtitle: 'We are packing your book at our warehouse',
      time: null,
      completed: false,
      current: false,
    },
    {
      id: 'destination',
      title: 'Delivering to you',
      subtitle: deliveryAddress ?? null,
      time: null,
      completed: false,
      current: false,
    },
  ];
  return applyPhaseToRouteSteps(steps, resolvedPhase);
}

export function buildBookingRouteSteps(
  order: UserOrder,
  tracking: ShipmentTracking | null | undefined,
  deliveryAddress?: string | null,
  userFacing = true,
): RouteStep[] {
  const phase = resolveShipmentPhase(order, tracking);

  if (tracking && (tracking.origin || tracking.status || (tracking.scans?.length ?? 0) > 0)) {
    return buildRouteSteps(tracking, userFacing, deliveryAddress, phase);
  }
  return buildPreTrackingRouteSteps(order, deliveryAddress, phase);
}

type BookingRouteProps = {
  order: UserOrder;
  tracking?: ShipmentTracking | null;
  deliveryAddress?: string | null;
  userFacing?: boolean;
};

export function BookingRouteTimeline({
  order,
  tracking,
  deliveryAddress,
  userFacing = true,
}: BookingRouteProps) {
  const steps = buildBookingRouteSteps(order, tracking, deliveryAddress, userFacing);
  const headline = headlineShipmentStatus(order, tracking);
  const hasLive = Boolean(
    tracking && (tracking.origin || tracking.status || (tracking.scans?.length ?? 0) > 0),
  );

  return (
    <>
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 mb-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
          Current status
        </p>
        <p className="text-base font-black text-white">{headline}</p>
        {tracking?.statusLocation && (
          <p className="text-xs text-neutral-400 mt-1 flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
            {tracking.statusLocation}
          </p>
        )}
        {tracking?.expectedDeliveryDate && (
          <p className="text-xs text-neutral-500 mt-2">
            Expected: {formatScanTime(tracking.expectedDeliveryDate)}
          </p>
        )}
      </div>

      <p className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 mb-4">
        {hasLive ? 'Delivery route' : 'Your delivery journey'}
      </p>

      <RouteStepsList steps={steps} />
    </>
  );
}

type TimelineProps = {
  tracking: ShipmentTracking | null;
  userFacing?: boolean;
  emptyMessage?: string;
  deliveryAddress?: string | null;
  order?: UserOrder;
};

export function ShipmentRouteTimeline({
  tracking,
  userFacing,
  emptyMessage = 'No route steps yet. Check again after your order ships.',
  deliveryAddress,
  order,
}: TimelineProps) {
  const phase = order ? resolveShipmentPhase(order, tracking) : undefined;
  const steps = buildRouteSteps(tracking, userFacing, deliveryAddress, phase);

  if (!tracking) return null;

  return (
    <>
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 mb-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
          Current status
        </p>
        <p className="text-base font-black text-white">
          {order
            ? headlineShipmentStatus(order, tracking)
            : userFacing
              ? friendlyCourierStatus(tracking.status)
              : (tracking.status ?? '—')}
        </p>
        {tracking.statusLocation && (
          <p className="text-xs text-neutral-400 mt-1 flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
            {tracking.statusLocation}
          </p>
        )}
        {tracking.expectedDeliveryDate && (
          <p className="text-xs text-neutral-500 mt-2">
            Expected: {formatScanTime(tracking.expectedDeliveryDate)}
          </p>
        )}
      </div>

      <p className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 mb-4">
        Delivery route
      </p>

      {steps.length === 0 ? (
        <p className="text-sm text-neutral-500">{emptyMessage}</p>
      ) : (
        <RouteStepsList steps={steps} />
      )}
    </>
  );
}

export type { RouteStep } from './RouteStepsList';

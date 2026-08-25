import React from 'react';
import type { ShipmentTracking, UserOrder } from '../../lib/api';
import {
  headlineShipmentStatus,
  isInTransitPhase,
  resolveShipmentPhase,
  trackingIsDelivered,
} from '../../lib/shipmentStatus';

type Props = {
  order: Pick<UserOrder, 'status' | 'delhivery_waybill' | 'delhivery_status'>;
  tracking?: ShipmentTracking | null;
};

/** User-facing status pill — uses unified Delhivery + order phase. */
export function ShipmentStatusChip({ order, tracking }: Props) {
  const phase = resolveShipmentPhase(order, tracking);
  const label = headlineShipmentStatus(order, tracking);
  const delivered = phase === 'delivered' || trackingIsDelivered(tracking);

  const style = delivered
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : isInTransitPhase(phase)
      ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
      : phase === 'ready_to_ship'
        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
        : phase === 'preparing'
          ? 'bg-orange-500/10 text-orange-300 border-orange-500/20'
          : 'bg-sky-500/10 text-sky-300 border-sky-500/20';

  return (
    <span
      className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded border ${style}`}
    >
      {label}
    </span>
  );
}

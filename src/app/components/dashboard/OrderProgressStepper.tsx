import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { ShipmentTracking, UserOrder } from '../../lib/api';
import { SHIPMENT_PROGRESS_STEPS, shipmentProgressStep } from '../../lib/shipmentStatus';

type Props = {
  order: Pick<UserOrder, 'status'>;
  tracking?: ShipmentTracking | null;
  /** Compact row on bookings list */
  compact?: boolean;
};

/** Confirmed → Processing → Shipped → Delivered (Delhivery-aware step index). */
export function OrderProgressStepper({ order, tracking, compact }: Props) {
  const current = shipmentProgressStep(order, tracking);
  const dot = compact ? 'w-7 h-7' : 'w-8 h-8';
  const icon = compact ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="flex items-center">
      {SHIPMENT_PROGRESS_STEPS.map((step, i) => {
        const done = i <= current;
        const isActive = i === current;
        return (
          <React.Fragment key={step.key}>
            {i > 0 && (
              <div
                className={`flex-1 h-0.5 ${done ? 'bg-gradient-to-r from-cyan-500 to-indigo-500' : 'bg-white/[0.06]'}`}
              />
            )}
            <div className={`flex flex-col items-center ${compact ? 'gap-1.5' : 'gap-2'} shrink-0`}>
              <div
                className={`${dot} rounded-full flex items-center justify-center border-2 transition-all ${
                  done
                    ? 'bg-gradient-to-br from-cyan-400 to-indigo-500 border-transparent shadow-[0_0_12px_rgba(56,189,248,0.45)]'
                    : 'bg-[#0A0A0A] border-white/10'
                } ${isActive ? 'ring-4 ring-cyan-500/20' : ''}`}
              >
                {done ? (
                  <CheckCircle2 className={`${icon} text-white`} />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                )}
              </div>
              <span
                className={`text-[9px] font-bold tracking-wider uppercase whitespace-nowrap ${
                  done ? 'text-white' : 'text-neutral-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

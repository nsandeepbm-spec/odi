import React from 'react';
import { MapPin } from 'lucide-react';

export type RouteStep = {
  id: string;
  title: string;
  subtitle: string | null;
  time: string | null;
  completed: boolean;
  current: boolean;
};

function formatStepTime(iso: string | null) {
  if (!iso) return null;
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

/** Shared vertical step list — green done, cyan in progress, white pending. */
export function RouteStepsList({ steps }: { steps: RouteStep[] }) {
  return (
    <ol className="relative ml-3 pt-1">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const lineCompleted = step.completed && !isLast;
        const pending = !step.completed && !step.current;
        return (
          <li key={step.id} className="relative pl-6 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[5px] top-3 w-0.5 bottom-0 ${
                  lineCompleted ? 'bg-emerald-500' : 'bg-neutral-700'
                }`}
              />
            )}
            <span
              className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 ${
                step.completed
                  ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.35)]'
                  : step.current
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.25)]'
                    : 'bg-[#0a0a0a] border-white/25'
              }`}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <p
                  className={`text-sm font-bold ${
                    step.completed
                      ? 'text-emerald-400'
                      : step.current
                        ? 'text-cyan-300'
                        : 'text-white'
                  }`}
                >
                  {step.title}
                </p>
                {step.time && (
                  <p
                    className={`text-[10px] shrink-0 ${
                      pending ? 'text-neutral-500' : 'text-neutral-500'
                    }`}
                  >
                    {formatStepTime(step.time)}
                  </p>
                )}
              </div>
              {step.subtitle && (
                <p
                  className={`text-xs mt-0.5 flex items-start gap-1 leading-relaxed ${
                    pending ? 'text-neutral-500' : 'text-neutral-400'
                  }`}
                >
                  <MapPin className="w-3 h-3 shrink-0 mt-0.5 opacity-60" />
                  <span>{step.subtitle}</span>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

import { ODIColorLogo } from './ODIColorLogo';

type ODILoaderProps = {
  /** Optional status line under the logo */
  label?: string;
  /** Logo width: sm ~72px, md ~112px, lg ~148px */
  size?: 'sm' | 'md' | 'lg';
  /** full = min-h-screen centred; block = padded content area; inline = compact */
  variant?: 'full' | 'block' | 'inline';
  className?: string;
};

const SIZE: Record<NonNullable<ODILoaderProps['size']>, string> = {
  sm: 'w-[4.5rem]',
  md: 'w-28',
  lg: 'w-36',
};

/**
 * Branded loading state — colour ODI logo + soft pulse using homepage gradient glow.
 */
export function ODILoader({
  label,
  size = 'md',
  variant = 'block',
  className = '',
}: ODILoaderProps) {
  const shell =
    variant === 'full'
      ? 'min-h-screen flex items-center justify-center bg-[#F7F7F5]'
      : variant === 'inline'
        ? 'inline-flex items-center justify-center'
        : 'flex flex-col items-center justify-center py-20 sm:py-24';

  return (
    <div className={`${shell} ${className}`} role="status" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center">
          {/* Soft brand glow */}
          <div
            className="absolute inset-0 scale-150 rounded-full blur-2xl opacity-40 animate-pulse"
            style={{
              background:
                'radial-gradient(circle, rgba(6,182,212,0.45) 0%, rgba(99,102,241,0.35) 45%, rgba(124,58,237,0.25) 70%, transparent 75%)',
            }}
            aria-hidden
          />
          <div className={`relative ${SIZE[size]} odi-loader-breathe`}>
            <ODIColorLogo className="w-full h-auto drop-shadow-sm" />
          </div>
        </div>
        {label ? (
          <p className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-neutral-400">
            {label}
          </p>
        ) : (
          <span className="sr-only">Loading</span>
        )}
      </div>
    </div>
  );
}

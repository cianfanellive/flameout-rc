// Hand-drawn brand marks — kept as inline SVG (no icon-font, no stock art)
// so the racing motifs stay crisp at any size and match the brand palette.

export function FlameMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12.3 2.2c.6 2.1-.4 3.4-1.6 4.7-1.6 1.7-3.4 3.6-3.4 6.6a4.7 4.7 0 0 0 4.7 4.7c.3 0 .6 0 .9-.1a4 4 0 0 1-1-2.7c0-1.9 1.3-2.9 2.4-4 .1 1 .5 1.7 1.1 2.4.9 1.1 1.9 2.3 1.9 4.1a4.7 4.7 0 0 1-4.7 4.7c-4.4 0-7.9-3.4-7.9-8.2 0-5 3.6-7.7 6.1-10.2.5-.5.9-1.1 1.5-2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CheckeredFlagIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M5 3v18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M5 3h6l2 2h6l-2 2h2l-2 2h-6l-2-2H5V3zm0 6h6l2 2h6l-2 2h2l-2 2h-6l-2-2H5V9z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ShirtIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M8 3 4 6l1.6 2.4L7 7.6V20h10V7.6l1.4.8L20 6l-4-3-2 1.6h-4L8 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CapIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 5a7 7 0 0 0-6.9 6H3l1 3h16l1-3h-2.1A7 7 0 0 0 12 5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 5.6A5 5 0 0 1 12 5v6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function GaugeIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 15a8 8 0 1 1 16 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M12 15 16 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function BoltIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
    </svg>
  );
}

export function TruckIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M3 16V7h9l4 4h4v5h-2M9 16H3M9 16h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

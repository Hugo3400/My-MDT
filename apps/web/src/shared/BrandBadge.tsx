// Emblème générique de démonstration — à remplacer par le logo du client (section 3.1 : logo configurable par organisme).
export function BrandBadge() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-panel-border bg-panel-surface shadow-inner shadow-black/40">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-panel-accent/30 via-transparent to-transparent" />
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-panel-accent" fill="currentColor" aria-hidden="true">
        <path d="M12 2 4 5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V5l-8-3Zm0 2.2 6 2.25V11c0 3.9-2.6 7.1-6 8-3.4-.9-6-4.1-6-8V6.45l6-2.25Z" />
        <path d="m11 13.5-2.5-2.5-1.4 1.4L11 16.3l6-6-1.4-1.4L11 13.5Z" />
      </svg>
    </div>
  );
}

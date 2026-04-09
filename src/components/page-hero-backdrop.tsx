/**
 * Soft teal / emerald mesh aligned with the logo (#0d9488).
 */
export function PageHeroBackdrop() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 via-white/98 to-emerald-50/90 dark:from-slate-950/95 dark:via-gray-900/98 dark:to-slate-900/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(13,148,136,0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(45,212,191,0.08),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_100%,rgba(16,185,129,0.07),transparent_50%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_100%_100%,rgba(52,211,153,0.06),transparent_50%)]" />
    </div>
  );
}

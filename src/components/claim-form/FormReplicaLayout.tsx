import type { ReactNode } from "react";

type Props = {
  /** e.g. "1 of 10" */
  sectionLabel?: string;
  /** Uppercase heading style like the paper form */
  title: string;
  subtitle?: string;
  children: ReactNode;
};

/**
 * Visual frame suggesting the official Florida no-fault application layout.
 * Not a government form — a worksheet for your own records.
 */
export function FormReplicaLayout({
  sectionLabel,
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="rounded-none border-2 border-slate-800 bg-white dark:border-slate-500 dark:bg-slate-950">
      <div className="border-b-2 border-slate-800 bg-slate-100 px-4 py-3 dark:border-slate-500 dark:bg-slate-900">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          {sectionLabel && (
            <span className="font-mono text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">
              {sectionLabel}
            </span>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Worksheet — match your insurer&apos;s wording
          </span>
        </div>
        <h2 className="mt-2 text-center font-serif text-lg font-bold uppercase leading-snug tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-xs font-normal normal-case text-slate-600 dark:text-slate-300">
            {subtitle}
          </p>
        )}
      </div>
      <div className="p-4 md:p-6">{children}</div>
    </div>
  );
}

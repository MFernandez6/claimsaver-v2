import { Info } from "lucide-react";

type Props = {
  children: React.ReactNode;
  title?: string;
};

/**
 * Non-legal tips: common patterns only — not advice about your situation.
 */
export function FormHelpCallout({ children, title = "Often people…" }: Props) {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-200">
      <Info
        className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400"
        aria-hidden
      />
      <div>
        <p className="font-medium text-slate-800 dark:text-slate-100">
          {title}
        </p>
        <div className="mt-1 space-y-1.5 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

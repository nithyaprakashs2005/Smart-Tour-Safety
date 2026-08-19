import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
}

export function DashboardCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  noPadding = false,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/[0.02]",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-5 py-3.5">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight text-slate-900">{title}</h3>
          {description && (
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className={cn("flex min-h-0 flex-1 flex-col", !noPadding && "p-5", contentClassName)}>
        {children}
      </div>
    </section>
  );
}

import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  hint: string;
}

export function StatCard({ label, value, delta, trend, hint }: Props) {
  const isUp = trend === "up";
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/85 p-5 text-white shadow-lg group">
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[image:var(--gradient-primary)] opacity-[0.07] group-hover:opacity-15 transition-opacity" />
      <div className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-3xl font-bold font-display tracking-tight">{value}</div>
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
            isUp
              ? "text-[color:var(--success)] bg-[color:var(--success)]/10"
              : "text-[color:var(--info)] bg-[color:var(--info)]/10"
          }`}
        >
          {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {delta}
        </span>
      </div>
      <div className="mt-1 text-xs text-slate-400">{hint}</div>
    </div>
  );
}

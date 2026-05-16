import type { Goal } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";

const statusStyles: Record<Goal["status"], string> = {
  "on-track": "text-[color:var(--success)] bg-[color:var(--success)]/12 border-[color:var(--success)]/30",
  "at-risk": "text-[color:var(--warning)] bg-[color:var(--warning)]/12 border-[color:var(--warning)]/30",
  "off-track": "text-[color:var(--destructive)] bg-[color:var(--destructive)]/12 border-[color:var(--destructive)]/30",
  "completed": "text-[color:var(--info)] bg-[color:var(--info)]/12 border-[color:var(--info)]/30",
};

const categoryStyles: Record<Goal["category"], string> = {
  OKR: "bg-primary/10 text-primary",
  KPI: "bg-[color:var(--accent)]/15 text-[color:var(--accent-foreground)]",
  Team: "bg-[color:var(--chart-3)]/15 text-[color:var(--chart-3)]",
  Personal: "bg-[color:var(--chart-4)]/15 text-[color:var(--chart-4)]",
};

export function GoalRow({ goal }: { goal: Goal }) {
  return (
    <div className="grid grid-cols-12 gap-3 items-center px-4 py-3 rounded-xl hover:bg-foreground/5 transition-colors">
      <div className="col-span-12 md:col-span-5">
        <div className="text-sm font-semibold leading-tight">{goal.title}</div>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span className="font-mono">{goal.id}</span>
          <span>·</span>
          <span>{goal.owner}</span>
          <span>·</span>
          <span>Due {goal.dueDate}</span>
        </div>
      </div>
      <div className="col-span-4 md:col-span-1">
        <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md ${categoryStyles[goal.category]}`}>
          {goal.category}
        </span>
      </div>
      <div className="col-span-4 md:col-span-3">
        <div className="flex items-center gap-2">
          <Progress value={goal.progress} className="h-1.5" />
          <span className="text-xs font-semibold tabular-nums w-9 text-right">{goal.progress}%</span>
        </div>
      </div>
      <div className="col-span-4 md:col-span-3 flex justify-end">
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusStyles[goal.status]}`}>
          {goal.status.replace("-", " ")}
        </span>
      </div>
    </div>
  );
}

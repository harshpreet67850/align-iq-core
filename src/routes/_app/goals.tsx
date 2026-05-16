import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Filter, Plus } from "lucide-react";
import { goals, type Goal } from "@/lib/mock-data";
import { GoalRow } from "@/components/goal-row";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/goals")({
  head: () => ({ meta: [{ title: "Goals — AlignIQ" }] }),
  component: GoalsPage,
});

const filters: { label: string; match: (g: Goal) => boolean }[] = [
  { label: "All", match: () => true },
  { label: "On track", match: (g) => g.status === "on-track" },
  { label: "At risk", match: (g) => g.status === "at-risk" },
  { label: "Off track", match: (g) => g.status === "off-track" },
  { label: "Completed", match: (g) => g.status === "completed" },
];

function GoalsPage() {
  const [active, setActive] = useState(0);
  const list = goals.filter(filters[active].match);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-sm text-muted-foreground mt-1">Track, align, and measure progress across the organization.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-background/60"><Filter className="h-4 w-4 mr-1.5" /> Filters</Button>
          <Button className="bg-[image:var(--gradient-primary)]"><Plus className="h-4 w-4 mr-1.5" /> New goal</Button>
        </div>
      </div>

      <div className="glass rounded-2xl p-2 flex flex-wrap gap-1">
        {filters.map((f, i) => (
          <button
            key={f.label}
            onClick={() => setActive(i)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              active === i ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elevated)]" : "hover:bg-foreground/5 text-foreground/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="glass-strong rounded-2xl p-3">
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <div className="col-span-5">Goal</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-3">Progress</div>
          <div className="col-span-3 text-right">Status</div>
        </div>
        <div className="divide-y divide-border/40">
          {list.map((g) => <GoalRow key={g.id} goal={g} />)}
        </div>
      </div>
    </div>
  );
}

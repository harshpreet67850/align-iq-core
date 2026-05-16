import { createFileRoute } from "@tanstack/react-router";
import { Mail, MoreHorizontal } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_app/team")({
  head: () => ({ meta: [{ title: "Team — AlignIQ" }] }),
  component: TeamPage,
});

const members = [
  { name: "Ava Chen", role: "Senior Designer", avatar: "AC", goals: 6, progress: 72, status: "On track" },
  { name: "Daniel Park", role: "Sales Lead", avatar: "DP", goals: 4, progress: 58, status: "At risk" },
  { name: "Lena Ortiz", role: "Engineering Manager", avatar: "LO", goals: 8, progress: 89, status: "On track" },
  { name: "Marcus Hill", role: "Director of Growth", avatar: "MH", goals: 5, progress: 64, status: "On track" },
  { name: "Priya Natarajan", role: "Head of People", avatar: "PN", goals: 7, progress: 81, status: "On track" },
  { name: "Sam Whittaker", role: "Product Manager", avatar: "SW", goals: 3, progress: 34, status: "Off track" },
];

function TeamPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team</h1>
        <p className="text-sm text-muted-foreground mt-1">Members across departments and their goal progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {members.map((m) => (
          <div key={m.name} className="glass-strong rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground font-semibold">
                {m.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.role}</div>
              </div>
              <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-foreground/5 text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-background/40 py-2">
                <div className="text-lg font-bold font-display">{m.goals}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Goals</div>
              </div>
              <div className="rounded-xl bg-background/40 py-2">
                <div className="text-lg font-bold font-display">{m.progress}%</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Progress</div>
              </div>
              <div className="rounded-xl bg-background/40 py-2">
                <div className={`text-xs font-semibold mt-1.5 ${
                  m.status === "On track" ? "text-[color:var(--success)]" :
                  m.status === "At risk" ? "text-[color:var(--warning)]" : "text-[color:var(--destructive)]"
                }`}>{m.status}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Status</div>
              </div>
            </div>

            <Progress value={m.progress} className="h-1.5 mt-4" />

            <button className="mt-4 w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors">
              <Mail className="h-3.5 w-3.5" /> Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

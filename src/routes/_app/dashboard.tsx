import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";
import { ArrowUpRight, Plus, Calendar } from "lucide-react";
import { useSession } from "@/lib/use-session";
import { statsForRole, progressTrend, categoryBreakdown, teamPerformance, goals, activityFeed } from "@/lib/mock-data";
import { StatCard } from "@/components/stat-card";
import { GoalRow } from "@/components/goal-row";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AlignIQ" },
      { name: "description", content: "Real-time overview of goals, performance, and team alignment." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const user = useSession();
  if (!user) return null;
  const stats = statsForRole(user.role);
  const visibleGoals = user.role === "employee"
    ? goals.filter((g) => g.owner === user.name).slice(0, 5)
    : goals.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero greeting */}
      <section className="glass-strong rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-mesh)] opacity-60 pointer-events-none" />
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Q4 · Week 9 of 13
          </div>
          <h1 className="mt-2 text-3xl lg:text-4xl font-bold tracking-tight">
            Good morning, <span className="gradient-text">{user.name.split(" ")[0]}</span>.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-lg">
            {user.role === "admin" && "Company-wide goal completion is up 4.1% this quarter. Two teams need attention."}
            {user.role === "manager" && "Your team is tracking 81% on-target. 7 reviews are awaiting your sign-off."}
            {user.role === "employee" && "You're on a 14-day update streak. One goal needs a check-in this week."}
          </p>
        </div>
        <div className="relative flex gap-2">
          <Button variant="outline" className="bg-background/60">
            <Calendar className="h-4 w-4 mr-1.5" /> Schedule 1:1
          </Button>
          <Button className="bg-[image:var(--gradient-primary)] shadow-[var(--shadow-elevated)]">
            <Plus className="h-4 w-4 mr-1.5" /> New goal
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-strong rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-lg">Goal completion trend</h2>
              <p className="text-xs text-muted-foreground">Actual vs. target — last 7 months</p>
            </div>
            <div className="flex gap-3 text-xs">
              <Legend2 color="var(--chart-1)" label="Completion" />
              <Legend2 color="var(--chart-2)" label="Target" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={progressTrend} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)", border: "1px solid var(--border)",
                  borderRadius: "12px", fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="target" stroke="var(--chart-2)" strokeWidth={2} fill="url(#g2)" />
              <Area type="monotone" dataKey="completion" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-strong rounded-2xl p-5">
          <h2 className="font-display font-semibold text-lg">Goals by category</h2>
          <p className="text-xs text-muted-foreground">Distribution across the org</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {categoryBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--popover)", border: "1px solid var(--border)",
                  borderRadius: "12px", fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {categoryBreakdown.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.color }} />
                <span className="text-muted-foreground">{c.name}</span>
                <span className="ml-auto font-semibold tabular-nums">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team performance + activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-strong rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-lg">Performance by team</h2>
              <p className="text-xs text-muted-foreground">Goal status breakdown</p>
            </div>
            <div className="flex gap-3 text-xs">
              <Legend2 color="var(--chart-3)" label="On track" />
              <Legend2 color="var(--chart-4)" label="At risk" />
              <Legend2 color="var(--chart-5)" label="Off track" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={teamPerformance} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="team" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)", border: "1px solid var(--border)",
                  borderRadius: "12px", fontSize: "12px",
                }}
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              />
              <Bar dataKey="onTrack" stackId="a" fill="var(--chart-3)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="atRisk" stackId="a" fill="var(--chart-4)" />
              <Bar dataKey="offTrack" stackId="a" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-strong rounded-2xl p-5">
          <h2 className="font-display font-semibold text-lg">Activity</h2>
          <p className="text-xs text-muted-foreground">Recent updates across your org</p>
          <ul className="mt-4 space-y-3">
            {activityFeed.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center text-[11px] font-semibold shrink-0">
                  {a.who.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="text-xs leading-snug">
                  <span className="font-semibold">{a.who}</span>{" "}
                  <span className="text-muted-foreground">{a.action}</span>{" "}
                  <span className="font-medium">{a.target}</span>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{a.when}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Goals list */}
      <section className="glass-strong rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="font-display font-semibold text-lg">
              {user.role === "employee" ? "Your active goals" : "Recent goals"}
            </h2>
            <p className="text-xs text-muted-foreground">Sorted by priority and due date</p>
          </div>
          <Link to="/goals" className="text-xs font-semibold text-primary flex items-center gap-0.5 hover:underline">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-border/40">
          {visibleGoals.map((g) => (
            <GoalRow key={g.id} goal={g} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Legend2({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

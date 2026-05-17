import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { ArrowUpRight, Plus, Calendar } from "lucide-react";
import { useSession } from "@/lib/use-session";
import {
  progressTrend,
  categoryBreakdown,
  teamPerformance,
  goals,
  activityFeed,
} from "@/lib/mock-data";
import { StatCard } from "@/components/stat-card";
import { GoalRow } from "@/components/goal-row";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface DashboardGoal {
  status?: string;
  actualProgress?: number;
}

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AlignIQ" },
      {
        name: "description",
        content: "Real-time overview of goals, performance, and team alignment.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const user = useSession();
  const [dashboardGoals, setDashboardGoals] = useState<DashboardGoal[]>([]);

  useEffect(() => {
    const fetchDashboardGoals = async () => {
      const snapshot = await getDocs(collection(db, "goals"));
      setDashboardGoals(snapshot.docs.map((goalDoc) => goalDoc.data() as DashboardGoal));
    };

    fetchDashboardGoals();
  }, []);

  const totalGoals = dashboardGoals.length;
  const approvedGoals = dashboardGoals.filter((goal) => goal.status === "Approved").length;
  const averageProgress = useMemo(() => {
    if (dashboardGoals.length === 0) return 0;

    const totalProgress = dashboardGoals.reduce((sum, goal) => sum + (goal.actualProgress ?? 0), 0);

    return Math.round(totalProgress / dashboardGoals.length);
  }, [dashboardGoals]);

  if (!user) return null;
  const visibleGoals =
    user.role === "employee"
      ? goals.filter((g) => g.owner === user.name).slice(0, 5)
      : goals.slice(0, 5);

  return (
    <div className="space-y-6 text-slate-100">
      {/* Hero greeting */}
      <section className="relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/85 p-6 text-slate-100 shadow-xl lg:flex-row lg:items-center lg:justify-between lg:p-8">
        <div className="absolute inset-0 bg-[image:var(--gradient-mesh)] opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
            Q4 · Week 9 of 13
          </div>
          <h1 className="mt-2 text-3xl lg:text-4xl font-bold tracking-tight">
            Good morning, <span className="gradient-text">{user.name.split(" ")[0]}</span>.
          </h1>
          <p className="mt-2 max-w-lg text-slate-300">
            {user.role === "admin" &&
              "Company-wide goal completion is up 4.1% this quarter. Two teams need attention."}
            {user.role === "manager" &&
              "Your team is tracking 81% on-target. 7 reviews are awaiting your sign-off."}
            {user.role === "employee" &&
              "You're on a 14-day update streak. One goal needs a check-in this week."}
          </p>
        </div>
        <div className="relative flex gap-2">
          <Button
            variant="outline"
            className="border-white/10 bg-white/10 text-white hover:bg-white/15 hover:text-white"
          >
            <Calendar className="h-4 w-4 mr-1.5" /> Schedule 1:1
          </Button>
          <Button className="bg-[image:var(--gradient-primary)] shadow-[var(--shadow-elevated)]">
            <Plus className="h-4 w-4 mr-1.5" /> New goal
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Goals"
          value={String(totalGoals)}
          delta={`${Math.min(totalGoals, 8)} / 8`}
          trend="up"
          hint="Goals created this cycle"
        />
        <StatCard
          label="Approved Goals"
          value={String(approvedGoals)}
          delta={`${totalGoals === 0 ? 0 : Math.round((approvedGoals / totalGoals) * 100)}%`}
          trend="up"
          hint="Approved by manager"
        />
        <StatCard
          label="Average Progress"
          value={`${averageProgress}%`}
          delta={averageProgress === 100 ? "Done" : "Live"}
          trend="up"
          hint="Average actual progress"
        />
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-950/85 p-5 text-slate-100 shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-lg">Goal completion trend</h2>
              <p className="text-xs text-slate-400">Actual vs. target — last 7 months</p>
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
              <XAxis
                dataKey="month"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="var(--chart-2)"
                strokeWidth={2}
                fill="url(#g2)"
              />
              <Area
                type="monotone"
                dataKey="completion"
                stroke="var(--chart-1)"
                strokeWidth={2.5}
                fill="url(#g1)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/85 p-5 text-slate-100 shadow-lg">
          <h2 className="font-display font-semibold text-lg">Goals by category</h2>
          <p className="text-xs text-slate-400">Distribution across the org</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {categoryBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {categoryBreakdown.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.color }} />
                <span className="text-slate-300">{c.name}</span>
                <span className="ml-auto font-semibold tabular-nums">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team performance + activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-950/85 p-5 text-slate-100 shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-lg">Performance by team</h2>
              <p className="text-xs text-slate-400">Goal status breakdown</p>
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
              <XAxis
                dataKey="team"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              />
              <Bar dataKey="onTrack" stackId="a" fill="var(--chart-3)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="atRisk" stackId="a" fill="var(--chart-4)" />
              <Bar dataKey="offTrack" stackId="a" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/85 p-5 text-slate-100 shadow-lg">
          <h2 className="font-display font-semibold text-lg">Activity</h2>
          <p className="text-xs text-slate-400">Recent updates across your org</p>
          <ul className="mt-4 space-y-3">
            {activityFeed.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center text-[11px] font-semibold shrink-0">
                  {a.who
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="text-xs leading-snug">
                  <span className="font-semibold">{a.who}</span>{" "}
                  <span className="text-slate-400">{a.action}</span>{" "}
                  <span className="font-medium">{a.target}</span>
                  <div className="text-[11px] text-slate-500 mt-0.5">{a.when}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Goals list */}
      <section className="rounded-2xl border border-white/10 bg-slate-950/85 p-5 text-slate-100 shadow-lg">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="font-display font-semibold text-lg">
              {user.role === "employee" ? "Your active goals" : "Recent goals"}
            </h2>
            <p className="text-xs text-slate-400">Sorted by priority and due date</p>
          </div>
          <Link
            to="/goals"
            className="text-xs font-semibold text-indigo-300 flex items-center gap-0.5 hover:text-indigo-200 hover:underline"
          >
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
    <span className="flex items-center gap-1.5 text-slate-300">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

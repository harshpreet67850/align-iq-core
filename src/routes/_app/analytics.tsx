import { createFileRoute } from "@tanstack/react-router";
import { RadialBar, RadialBarChart, ResponsiveContainer, PolarAngleAxis, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { progressTrend } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — AlignIQ" }] }),
  component: AnalyticsPage,
});

const radial = [
  { name: "Engagement", value: 84, fill: "var(--chart-1)" },
  { name: "Alignment", value: 76, fill: "var(--chart-2)" },
  { name: "Velocity", value: 68, fill: "var(--chart-3)" },
];

function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep insights into organizational performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {radial.map((r) => (
          <div key={r.name} className="glass-strong rounded-2xl p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{r.name}</div>
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[r]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "var(--muted)" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="-mt-32 mb-12 text-center pointer-events-none">
              <div className="text-3xl font-bold font-display">{r.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-strong rounded-2xl p-5">
        <h2 className="font-display font-semibold text-lg">Quarterly trajectory</h2>
        <p className="text-xs text-muted-foreground mb-4">Completion vs. target across the cycle</p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={progressTrend} margin={{ left: -10, right: 10, top: 10 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }} />
            <Line type="monotone" dataKey="completion" stroke="var(--chart-1)" strokeWidth={3} dot={{ r: 4, fill: "var(--chart-1)" }} />
            <Line type="monotone" dataKey="target" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

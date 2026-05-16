import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, ShieldCheck, BarChart3, Users } from "lucide-react";
import { demoUsers, getSession, setSession, type Role } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AlignIQ" },
      { name: "description", content: "Sign in to AlignIQ, the modern enterprise goal setting and tracking portal." },
    ],
  }),
  component: LoginPage,
});

const roleMeta: Record<Role, { label: string; desc: string; icon: typeof Users }> = {
  employee: { label: "Employee", desc: "Track personal goals & check-ins", icon: Sparkles },
  manager: { label: "Manager", desc: "Oversee team performance", icon: Users },
  admin: { label: "Admin", desc: "Org-wide analytics & controls", icon: ShieldCheck },
};

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("employee");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (getSession()) navigate({ to: "/dashboard" });
  }, [navigate]);

  useEffect(() => {
    setEmail(demoUsers[role].email);
  }, [role]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSession(demoUsers[role]);
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Brand panel */}
        <section className="hidden lg:flex flex-col gap-8 p-10">
          <Link to="/login" className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center shadow-[var(--shadow-elevated)]">
              <span className="font-display font-bold text-primary-foreground text-lg">A</span>
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">AlignIQ</span>
          </Link>

          <div>
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight">
              Where strategy meets <span className="gradient-text">execution</span>.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-md">
              The enterprise OKR & performance platform built for teams that ship.
              Align goals, track progress, and grow people — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { icon: BarChart3, label: "Real-time analytics" },
              { icon: Users, label: "360° team visibility" },
              { icon: ShieldCheck, label: "SOC 2 & GDPR ready" },
              { icon: Sparkles, label: "AI-powered insights" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="glass rounded-xl p-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>Trusted by teams at</span>
            <div className="flex gap-5 font-display font-semibold text-foreground/60">
              <span>NORTHWIND</span><span>HELIX</span><span>VERTEX</span><span>ATLAS·CO</span>
            </div>
          </div>
        </section>

        {/* Login card */}
        <section className="glass-strong rounded-3xl p-8 sm:p-10">
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center">
              <span className="font-display font-bold text-primary-foreground">A</span>
            </div>
            <span className="font-display text-xl font-bold">AlignIQ</span>
          </div>

          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a role to explore the portal with demo data.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {(Object.keys(roleMeta) as Role[]).map((r) => {
              const meta = roleMeta[r];
              const active = role === r;
              const Icon = meta.icon;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    active
                      ? "border-primary/60 bg-primary/8 shadow-[var(--shadow-elevated)]"
                      : "border-border bg-card/40 hover:bg-card/70"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="mt-2 text-sm font-semibold">{meta.label}</div>
                  <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                    {meta.desc}
                  </div>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                defaultValue="demo-password"
                className="bg-background/60"
              />
            </div>

            <Button type="submit" size="lg" className="w-full bg-[image:var(--gradient-primary)] hover:opacity-95 shadow-[var(--shadow-elevated)]">
              Sign in to AlignIQ
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Demo mode — credentials are pre-filled. Switch roles above to preview different dashboards.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

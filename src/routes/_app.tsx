import { Link, Outlet, useRouterState, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard, Target, Users, BarChart3, Settings, LogOut, Search, Sparkles,
} from "lucide-react";
import { clearSession } from "@/lib/auth";
import { useSession } from "@/lib/use-session";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NotificationsCenter } from "@/components/notifications-center";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/team", label: "Team", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

function AppLayout() {
  const user = useSession();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (user === null) {
      // wait one tick — session hook hydrates client-side
      const t = setTimeout(() => {
        if (!localStorage.getItem("aligniq_session")) navigate({ to: "/login" });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [user, navigate]);

  const logout = () => {
    clearSession();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col gap-2 p-4 sticky top-0 h-screen">
        <div className="glass-strong rounded-2xl p-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center">
            <span className="font-display font-bold text-primary-foreground">A</span>
          </div>
          <div>
            <div className="font-display font-bold tracking-tight">AlignIQ</div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Enterprise</div>
          </div>
        </div>

        <nav className="glass rounded-2xl p-3 flex-1 flex flex-col gap-1">
          {nav.map((item) => {
            const active = path === item.to || path.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elevated)]"
                    : "text-foreground/75 hover:bg-foreground/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          <div className="mt-auto p-3 rounded-xl bg-[image:var(--gradient-accent)] text-accent-foreground">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> AlignIQ AI
            </div>
            <p className="text-xs mt-1.5 opacity-90 leading-snug">
              Generate quarterly OKR suggestions from your team's trajectory.
            </p>
            <Button size="sm" variant="secondary" className="mt-2 w-full bg-background/80 text-foreground hover:bg-background">
              Try now
            </Button>
          </div>
        </nav>

        {user && (
          <div className="glass rounded-2xl p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground font-semibold text-sm">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{user.name}</div>
              <div className="text-[11px] text-muted-foreground capitalize">{user.role} · {user.team}</div>
            </div>
            <button onClick={logout} className="h-9 w-9 grid place-items-center rounded-lg hover:bg-foreground/5 text-muted-foreground" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 px-4 lg:px-8 pt-4">
          <div className="glass-strong rounded-2xl px-4 lg:px-6 py-3 flex items-center gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search goals, people, or teams…"
                className="pl-9 bg-background/50 border-border/60"
              />
            </div>
            <NotificationsCenter />
            {user && (
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border/60">
                <div className="text-right">
                  <div className="text-sm font-semibold leading-tight">{user.name}</div>
                  <div className="text-[11px] text-muted-foreground capitalize">{user.role}</div>
                </div>
                <div className="h-9 w-9 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground font-semibold text-xs">
                  {user.avatar}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

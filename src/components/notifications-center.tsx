import { useMemo, useState } from "react";
import { Bell, Check, Settings2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSession } from "@/lib/use-session";
import { notificationsFor, type Notification, type NotifKind } from "@/lib/notifications";

const toneStyles: Record<Notification["tone"], string> = {
  info: "bg-[color:var(--info)]/12 text-[color:var(--info)]",
  warning: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
  success: "bg-[color:var(--success)]/12 text-[color:var(--success)]",
  danger: "bg-[color:var(--destructive)]/12 text-[color:var(--destructive)]",
};

const tabs: { id: "all" | NotifKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "due", label: "Due dates" },
  { id: "approval", label: "Approvals" },
  { id: "status", label: "Status" },
];

export function NotificationsCenter() {
  const user = useSession();
  const base = useMemo(() => (user ? notificationsFor(user.role) : []), [user]);
  const [items, setItems] = useState<Notification[]>(base);
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");

  // Re-sync when role changes
  useMemo(() => setItems(base), [base]);

  const unread = items.filter((n) => n.unread).length;
  const visible = tab === "all" ? items : items.filter((n) => n.kind === tab);

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  const markOne = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative h-10 w-10 rounded-xl hover:bg-foreground/5 grid place-items-center transition-colors"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[image:var(--gradient-primary)] text-[10px] font-bold text-primary-foreground grid place-items-center shadow-[var(--shadow-elevated)]">
              {unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[min(380px,calc(100vw-1.5rem))] p-0 glass-strong border-border/60 rounded-2xl overflow-hidden"
      >
        <div className="p-4 pb-3 flex items-center justify-between">
          <div>
            <div className="font-display font-semibold">Notifications</div>
            <div className="text-[11px] text-muted-foreground">
              {unread > 0 ? `${unread} unread` : "You're all caught up"}
              {user && <span className="capitalize"> · {user.role}</span>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={markAllRead}
              disabled={unread === 0}
              className="text-[11px] font-semibold px-2 py-1 rounded-md hover:bg-foreground/5 text-primary disabled:text-muted-foreground disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Check className="h-3 w-3" /> Mark all read
            </button>
            <button
              className="h-7 w-7 grid place-items-center rounded-md hover:bg-foreground/5 text-muted-foreground"
              aria-label="Notification settings"
            >
              <Settings2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="px-3 flex gap-1 border-b border-border/40 pb-2 overflow-x-auto">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? "bg-[image:var(--gradient-primary)] text-primary-foreground"
                    : "text-foreground/70 hover:bg-foreground/5"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <ul className="max-h-[420px] overflow-y-auto divide-y divide-border/40">
          {visible.length === 0 && (
            <li className="px-4 py-10 text-center text-xs text-muted-foreground">
              Nothing here yet.
            </li>
          )}
          {visible.map((n) => {
            const Icon = n.icon;
            return (
              <li
                key={n.id}
                className={`group px-4 py-3 flex gap-3 hover:bg-foreground/5 transition-colors ${
                  n.unread ? "bg-primary/[0.035]" : ""
                }`}
              >
                <div className={`h-9 w-9 shrink-0 rounded-xl grid place-items-center ${toneStyles[n.tone]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <div className="text-sm font-semibold leading-tight flex-1">{n.title}</div>
                    {n.unread && <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" aria-label="Unread" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.body}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{n.when}</span>
                    <div className="flex items-center gap-2">
                      {n.actionLabel && (
                        <button className="text-[11px] font-semibold text-primary hover:underline">
                          {n.actionLabel}
                        </button>
                      )}
                      {n.unread && (
                        <button
                          onClick={() => markOne(n.id)}
                          className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="p-2 border-t border-border/40 bg-background/40">
          <button className="w-full text-xs font-semibold py-2 rounded-lg hover:bg-foreground/5 text-foreground/80">
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

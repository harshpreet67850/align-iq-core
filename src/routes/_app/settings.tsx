import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/use-session";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — AlignIQ" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const user = useSession();
  if (!user) return null;

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile, notifications, and workspace preferences.</p>
      </div>

      <section className="glass-strong rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground font-semibold text-xl">
            {user.avatar}
          </div>
          <Button variant="outline" className="bg-background/60">Change photo</Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Full name</Label><Input defaultValue={user.name} className="bg-background/60" /></div>
          <div className="space-y-2"><Label>Email</Label><Input defaultValue={user.email} className="bg-background/60" /></div>
          <div className="space-y-2"><Label>Team</Label><Input defaultValue={user.team} className="bg-background/60" /></div>
          <div className="space-y-2"><Label>Role</Label><Input defaultValue={user.role} disabled className="bg-background/60 capitalize" /></div>
        </div>
      </section>

      <section className="glass-strong rounded-2xl p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg">Notifications</h2>
        {[
          { label: "Weekly progress digest", desc: "A summary every Monday at 9am" },
          { label: "Goal at-risk alerts", desc: "When a goal slips below pace" },
          { label: "Mentions and feedback", desc: "When someone tags or reviews you" },
        ].map((n, i) => (
          <div key={n.label} className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium">{n.label}</div>
              <div className="text-xs text-muted-foreground">{n.desc}</div>
            </div>
            <Switch defaultChecked={i !== 1} />
          </div>
        ))}
      </section>

      <div className="flex justify-end gap-2">
        <Button variant="outline" className="bg-background/60">Cancel</Button>
        <Button className="bg-[image:var(--gradient-primary)]">Save changes</Button>
      </div>
    </div>
  );
}

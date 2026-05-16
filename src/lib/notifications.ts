import type { Role } from "@/lib/auth";
import { CalendarClock, CheckCircle2, AlertTriangle, GitPullRequestArrow, MessageSquare, TrendingDown, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NotifKind = "due" | "approval" | "status" | "mention" | "system";

export interface Notification {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  when: string;
  unread: boolean;
  icon: LucideIcon;
  tone: "info" | "warning" | "success" | "danger";
  actionLabel?: string;
}

const employee: Notification[] = [
  { id: "n1", kind: "due", title: "Check-in due tomorrow", body: "Reduce onboarding time by 30% — weekly progress update", when: "in 1 day", unread: true, icon: CalendarClock, tone: "warning", actionLabel: "Update progress" },
  { id: "n2", kind: "status", title: "Goal moved to At Risk", body: "Complete leadership certification dropped below pace", when: "2h ago", unread: true, icon: AlertTriangle, tone: "danger", actionLabel: "Review" },
  { id: "n3", kind: "approval", title: "Goal approved by Marcus", body: "Reduce onboarding time by 30% is now active", when: "5h ago", unread: true, icon: CheckCircle2, tone: "success" },
  { id: "n4", kind: "mention", title: "Lena mentioned you", body: "“Loved your design system rollout plan, Ava.”", when: "Yesterday", unread: false, icon: MessageSquare, tone: "info" },
  { id: "n5", kind: "due", title: "Q4 self-review opens Mon", body: "Reflection prompts will be available Nov 18", when: "in 3 days", unread: false, icon: CalendarClock, tone: "info" },
];

const manager: Notification[] = [
  { id: "n1", kind: "approval", title: "3 goals awaiting your approval", body: "From Ava Chen, Daniel Park, and Sam Whittaker", when: "30m ago", unread: true, icon: GitPullRequestArrow, tone: "warning", actionLabel: "Review queue" },
  { id: "n2", kind: "status", title: "Sam's goal slipped to Off Track", body: "Sales playbook revamp — 34% with 2 weeks left", when: "1h ago", unread: true, icon: TrendingDown, tone: "danger", actionLabel: "Schedule 1:1" },
  { id: "n3", kind: "due", title: "7 reviews due this week", body: "Q4 mid-cycle sign-offs close Friday", when: "Due Fri", unread: true, icon: CalendarClock, tone: "warning" },
  { id: "n4", kind: "status", title: "Lena completed a key result", body: "Hire 3 senior engineers — 2 of 3 filled", when: "3h ago", unread: false, icon: CheckCircle2, tone: "success" },
  { id: "n5", kind: "mention", title: "Priya commented on your team plan", body: "“Aligns well with the People Ops roadmap.”", when: "Yesterday", unread: false, icon: MessageSquare, tone: "info" },
];

const admin: Notification[] = [
  { id: "n1", kind: "status", title: "Sales team trending down", body: "8 at-risk goals — 14% drop vs. last month", when: "20m ago", unread: true, icon: TrendingDown, tone: "danger", actionLabel: "Open analytics" },
  { id: "n2", kind: "approval", title: "Policy change requires approval", body: "New Q1 OKR framework — submitted by Marcus Hill", when: "1h ago", unread: true, icon: GitPullRequestArrow, tone: "warning", actionLabel: "Review policy" },
  { id: "n3", kind: "due", title: "Quarterly review cycle closes Fri", body: "84% of managers have submitted sign-offs", when: "in 4 days", unread: true, icon: CalendarClock, tone: "warning" },
  { id: "n4", kind: "system", title: "AlignIQ AI insight ready", body: "3 teams show alignment risk for Q1 planning", when: "2h ago", unread: false, icon: Sparkles, tone: "info", actionLabel: "View insight" },
  { id: "n5", kind: "status", title: "Engagement score rose to 8.4", body: "Up 0.3 points from October pulse survey", when: "Yesterday", unread: false, icon: CheckCircle2, tone: "success" },
];

export function notificationsFor(role: Role): Notification[] {
  if (role === "admin") return admin;
  if (role === "manager") return manager;
  return employee;
}

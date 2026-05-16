import type { Role } from "./auth";

export interface Goal {
  id: string;
  title: string;
  category: "OKR" | "KPI" | "Personal" | "Team";
  owner: string;
  progress: number;
  status: "on-track" | "at-risk" | "off-track" | "completed";
  dueDate: string;
  priority: "high" | "medium" | "low";
}

export const goals: Goal[] = [
  { id: "G-1042", title: "Reduce onboarding time by 30%", category: "OKR", owner: "Ava Chen", progress: 78, status: "on-track", dueDate: "Dec 18", priority: "high" },
  { id: "G-1043", title: "Launch design system v2", category: "Team", owner: "Ava Chen", progress: 92, status: "on-track", dueDate: "Nov 30", priority: "high" },
  { id: "G-1044", title: "Complete leadership certification", category: "Personal", owner: "Ava Chen", progress: 45, status: "at-risk", dueDate: "Jan 15", priority: "medium" },
  { id: "G-1045", title: "Improve NPS to 62", category: "KPI", owner: "Marcus Hill", progress: 64, status: "on-track", dueDate: "Dec 31", priority: "high" },
  { id: "G-1046", title: "Hire 3 senior engineers", category: "Team", owner: "Marcus Hill", progress: 33, status: "off-track", dueDate: "Nov 20", priority: "high" },
  { id: "G-1047", title: "Quarterly review cycle automation", category: "OKR", owner: "Priya Natarajan", progress: 100, status: "completed", dueDate: "Oct 28", priority: "medium" },
  { id: "G-1048", title: "Roll out engagement surveys", category: "Team", owner: "Priya Natarajan", progress: 58, status: "on-track", dueDate: "Dec 05", priority: "medium" },
  { id: "G-1049", title: "Mentor 2 junior designers", category: "Personal", owner: "Ava Chen", progress: 70, status: "on-track", dueDate: "Dec 31", priority: "low" },
];

export const progressTrend = [
  { month: "May", completion: 42, target: 50 },
  { month: "Jun", completion: 48, target: 55 },
  { month: "Jul", completion: 55, target: 60 },
  { month: "Aug", completion: 61, target: 65 },
  { month: "Sep", completion: 68, target: 70 },
  { month: "Oct", completion: 74, target: 75 },
  { month: "Nov", completion: 81, target: 80 },
];

export const categoryBreakdown = [
  { name: "OKRs", value: 38, color: "var(--chart-1)" },
  { name: "KPIs", value: 24, color: "var(--chart-2)" },
  { name: "Team", value: 22, color: "var(--chart-3)" },
  { name: "Personal", value: 16, color: "var(--chart-4)" },
];

export const teamPerformance = [
  { team: "Engineering", onTrack: 28, atRisk: 6, offTrack: 2 },
  { team: "Design", onTrack: 14, atRisk: 3, offTrack: 1 },
  { team: "Sales", onTrack: 22, atRisk: 8, offTrack: 4 },
  { team: "Marketing", onTrack: 18, atRisk: 4, offTrack: 1 },
  { team: "People Ops", onTrack: 11, atRisk: 2, offTrack: 0 },
];

export const activityFeed = [
  { who: "Marcus Hill", action: "approved goal", target: "Reduce onboarding time by 30%", when: "12m ago" },
  { who: "Ava Chen", action: "updated progress on", target: "Launch design system v2", when: "1h ago" },
  { who: "Priya Natarajan", action: "published", target: "Q4 Review Framework", when: "3h ago" },
  { who: "Daniel Park", action: "requested feedback on", target: "Sales playbook revamp", when: "5h ago" },
  { who: "Lena Ortiz", action: "completed", target: "Mentor 2 junior designers", when: "Yesterday" },
];

export function statsForRole(role: Role) {
  if (role === "admin") {
    return [
      { label: "Active Goals", value: "1,284", delta: "+12.4%", trend: "up" as const, hint: "vs. last quarter" },
      { label: "Completion Rate", value: "76%", delta: "+4.1%", trend: "up" as const, hint: "company-wide" },
      { label: "At-Risk Goals", value: "84", delta: "-6.2%", trend: "down" as const, hint: "lowest in 6mo" },
      { label: "Engagement Score", value: "8.4", delta: "+0.3", trend: "up" as const, hint: "out of 10" },
    ];
  }
  if (role === "manager") {
    return [
      { label: "Team Goals", value: "42", delta: "+3", trend: "up" as const, hint: "this cycle" },
      { label: "Team On Track", value: "81%", delta: "+5.0%", trend: "up" as const, hint: "vs. last month" },
      { label: "Pending Reviews", value: "7", delta: "-2", trend: "down" as const, hint: "due this week" },
      { label: "Avg Progress", value: "68%", delta: "+2.8%", trend: "up" as const, hint: "across reports" },
    ];
  }
  return [
    { label: "My Goals", value: "6", delta: "+1", trend: "up" as const, hint: "this quarter" },
    { label: "Overall Progress", value: "72%", delta: "+8.0%", trend: "up" as const, hint: "above target" },
    { label: "Next Check-in", value: "Tue", delta: "2 days", trend: "up" as const, hint: "with Marcus" },
    { label: "Streak", value: "14d", delta: "+3d", trend: "up" as const, hint: "weekly updates" },
  ];
}

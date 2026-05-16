export type Role = "employee" | "manager" | "admin";

export interface SessionUser {
  name: string;
  email: string;
  role: Role;
  team: string;
  avatar: string;
}

const KEY = "aligniq_session";

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function setSession(u: SessionUser) {
  localStorage.setItem(KEY, JSON.stringify(u));
  window.dispatchEvent(new Event("aligniq:session"));
}

export function clearSession() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("aligniq:session"));
}

export const demoUsers: Record<Role, SessionUser> = {
  employee: {
    name: "Ava Chen",
    email: "ava.chen@aligniq.com",
    role: "employee",
    team: "Product Design",
    avatar: "AC",
  },
  manager: {
    name: "Marcus Hill",
    email: "marcus.hill@aligniq.com",
    role: "manager",
    team: "Growth Engineering",
    avatar: "MH",
  },
  admin: {
    name: "Priya Natarajan",
    email: "priya.n@aligniq.com",
    role: "admin",
    team: "People Operations",
    avatar: "PN",
  },
};

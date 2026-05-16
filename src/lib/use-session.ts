import { useEffect, useState } from "react";
import { getSession, type SessionUser } from "./auth";

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  useEffect(() => {
    setUser(getSession());
    const h = () => setUser(getSession());
    window.addEventListener("aligniq:session", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("aligniq:session", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return user;
}

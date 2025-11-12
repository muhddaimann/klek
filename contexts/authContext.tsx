import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { router } from "expo-router";
import { useOverlay } from "../hooks/useOverlay";
import {
  clearAuth,
  getToken,
  getUser,
  saveToken,
  saveUser,
  deleteToken,
  deleteUser,
  saveExpiry,
  getExpiry,
  deleteExpiry,
} from "./tokenStorage";

type User = { username: string } | null;

type AuthCtx = {
  user: User;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  bootstrapped: boolean;
  clearError: () => void;
  expiresAt: number | null;
  remainingSec: number;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  signIn: async () => false,
  signOut: async () => {},
  bootstrapped: false,
  clearError: () => {},
  expiresAt: null,
  remainingSec: 0,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [remainingSec, setRemainingSec] = useState(0);

  const { toast, confirm, alert } = useOverlay();

  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const autoRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleTimers = useCallback(
    (exp: number) => {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = setInterval(() => {
        const now = Date.now();
        const left = Math.max(0, Math.ceil((exp - now) / 1000));
        setRemainingSec(left);
        if (left <= 0 && tickRef.current) clearInterval(tickRef.current);
      }, 1000);

      const delay = Math.max(0, exp - Date.now());
      if (autoRef.current) clearTimeout(autoRef.current);
      autoRef.current = setTimeout(async () => {
        await clearAuth();
        setUser(null);
        setExpiresAt(null);
        setRemainingSec(0);
        await alert({
          title: "Session expired",
          message: "Please sign in again.",
        });
        router.replace("/");
      }, delay);
    },
    [alert]
  );

  useEffect(() => {
    (async () => {
      const [token, storedUser, exp] = await Promise.all([
        getToken(),
        getUser(),
        getExpiry(),
      ]);
      const now = Date.now();
      if (token && storedUser && exp && exp > now) {
        setUser(storedUser);
        setExpiresAt(exp);
        setRemainingSec(Math.ceil((exp - now) / 1000));
        scheduleTimers(exp);
      } else {
        await clearAuth();
        if (exp && exp <= now) {
          await alert({
            title: "Session expired",
            message: "Please sign in again.",
          });
          router.replace("/");
        }
      }
      setBootstrapped(true);
    })();

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [scheduleTimers, alert]);

  const clearError = useCallback(() => setError(null), []);

  const signIn = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      setError(null);
      await new Promise((r) => setTimeout(r, 250));

      const ok = username === "user" && password === "123";
      if (ok) {
        const exp = Date.now() + 5 * 60 * 1000;
        await Promise.all([
          saveToken("demo-token"),
          saveUser({ username }),
          saveExpiry(exp),
        ]);
        setUser({ username });
        setExpiresAt(exp);
        setRemainingSec(Math.ceil((exp - Date.now()) / 1000));
        scheduleTimers(exp);
        toast({ message: `Signed in as ${username}`, variant: "success" });
        router.replace("/welcome");
      } else {
        const msg = "Invalid credentials";
        setError(msg);
        toast({ message: msg, variant: "error" });
      }
      setLoading(false);
      return ok;
    },
    [scheduleTimers, toast]
  );

  const signOut = useCallback(async () => {
    const ok = await confirm({
      title: "Sign out?",
      message: "You’ll be logged out from this device.",
      okText: "Sign out",
      cancelText: "Cancel",
      variant: "warning",
    });
    if (!ok) return;

    await Promise.all([deleteToken(), deleteUser(), deleteExpiry()]);
    setUser(null);
    setError(null);
    setExpiresAt(null);
    setRemainingSec(0);
    if (tickRef.current) clearInterval(tickRef.current);
    if (autoRef.current) clearTimeout(autoRef.current);
    toast({ message: "Signed out", variant: "info" });
    router.replace("/goodbye");
  }, [confirm, toast]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      error,
      signIn,
      signOut,
      bootstrapped,
      clearError,
      expiresAt,
      remainingSec,
    }),
    [
      user,
      loading,
      error,
      signIn,
      signOut,
      bootstrapped,
      clearError,
      expiresAt,
      remainingSec,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

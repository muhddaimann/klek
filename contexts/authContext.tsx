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
  StoredUser,
} from "./tokenStorage";
import {
  apiLogin,
  apiLogout,
  apiRegister,
  apiUpdateNickname,
} from "./api/auth";

type User = StoredUser | null;

type AuthCtx = {
  user: User;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  signOut: () => Promise<void>;
  bootstrapped: boolean;
  clearError: () => void;
  expiresAt: number | null;
  remainingSec: number;
  updateNickname: (nickname: string | null) => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  signIn: async () => false,
  register: async () => false,
  signOut: async () => {},
  bootstrapped: false,
  clearError: () => {},
  expiresAt: null,
  remainingSec: 0,
  updateNickname: async () => {},
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

      try {
        const data = await apiLogin(username, password);

        const token = data.token;
        const exp = data.expiresAt;
        const apiUser: StoredUser = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email ?? null,
          nickname: data.user.nickname ?? null,
        };

        await Promise.all([
          saveToken(token),
          saveUser(apiUser),
          saveExpiry(exp),
        ]);

        setUser(apiUser);
        setExpiresAt(exp);
        setRemainingSec(Math.ceil((exp - Date.now()) / 1000));
        scheduleTimers(exp);

        toast({
          message: `Signed in as ${apiUser.username}`,
          variant: "success",
        });
        router.replace("/welcome");
        setLoading(false);
        return true;
      } catch (e: any) {
        const msg = e?.message || "Sign in failed";
        setError(msg);
        toast({ message: msg, variant: "error" });
        setLoading(false);
        return false;
      }
    },
    [scheduleTimers, toast]
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        await apiRegister(username, email, password);

        toast({
          message: "Account created. You can now sign in.",
          variant: "success",
        });

        setLoading(false);

        router.back();
        setTimeout(() => {
          router.push("/(modals)/signIn");
        }, 1800);

        return true;
      } catch (e: any) {
        const msg = e?.message || "Registration failed";
        setError(msg);
        toast({ message: msg, variant: "error" });
        setLoading(false);
        return false;
      }
    },
    [router, toast]
  );

  const signOut = useCallback(async () => {
    const ok = await confirm({
      title: "Sign out?",
      message: "You’ll be logged out from this device.",
      okText: "Sign out",
      cancelText: "Cancel",
      variant: "error",
    });
    if (!ok) return;

    try {
      await apiLogout();
    } catch {}

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

  const updateNickname = useCallback(
    async (nickname: string | null) => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const data = await apiUpdateNickname(nickname ?? "");

        const updated: StoredUser = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email ?? null,
          nickname: data.user.nickname ?? null,
        };

        setUser(updated);
        await saveUser(updated);

        router.back();

        setTimeout(() => {
          const message = updated.nickname
            ? `Saved. Klek will call you “${updated.nickname}”.`
            : "Saved. Klek will call you by your username.";

          toast({
            message,
            variant: "success",
          });
        }, 250);
      } catch (e: any) {
        const msg = e?.message || "Failed to update profile";
        setError(msg);
        toast({ message: msg, variant: "error" });
      } finally {
        setLoading(false);
      }
    },
    [user, toast, router]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      error,
      signIn,
      register,
      signOut,
      bootstrapped,
      clearError,
      expiresAt,
      remainingSec,
      updateNickname,
    }),
    [
      user,
      loading,
      error,
      signIn,
      register,
      signOut,
      bootstrapped,
      clearError,
      expiresAt,
      remainingSec,
      updateNickname,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

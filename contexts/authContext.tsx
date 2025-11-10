import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

type User = { username: string } | null;

type AuthCtx = {
  user: User;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  bootstrapped: boolean;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  signIn: async () => false,
  signOut: async () => {},
  bootstrapped: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBootstrapped(true);
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 250));
    const ok = username === "user" && password === "123";
    if (ok) setUser({ username });
    else setError("Invalid credentials");
    setLoading(false);
    return ok;
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      error,
      signIn,
      signOut,
      bootstrapped,
    }),
    [user, loading, error, signIn, signOut, bootstrapped]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

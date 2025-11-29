import { useQuery } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

async function fetchUser(token) {
  const res = await fetch("/api/auth/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      return null;
    }
    throw new Error("Failed to fetch user");
  }
  return res.json();
}

export function useAuth() {
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        setToken(idToken);
      } else {
        setToken(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", token],
    queryFn: () => fetchUser(token),
    enabled: !!token,
  });

  const isLoading = isAuthLoading || (!!token && isUserLoading);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}

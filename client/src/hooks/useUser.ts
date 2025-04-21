import { useState, useEffect } from "react";

export function useUser() {
  const [user, setUserState] = useState<string | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("nexusai_username");
    if (storedUser) {
      setUserState(storedUser);
    }
  }, []);

  const setUser = (username: string) => {
    localStorage.setItem("nexusai_username", username);
    setUserState(username);
  };

  const clearUser = () => {
    localStorage.removeItem("nexusai_username");
    setUserState(null);
  };

  return { user, setUser, clearUser };
}

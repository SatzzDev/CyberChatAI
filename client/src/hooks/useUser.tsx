import { createContext, useState, useContext, useEffect, ReactNode } from "react";

// Create context
interface UserContextType {
  user: string | null;
  setUser: (username: string) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
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

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook for using the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

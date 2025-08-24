import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false); 

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/me");
        if (data?.success) {
          setUser(data.user);
          setLoggedIn(true);
        } else {
          setUser(null);
          setLoggedIn(false);
        }
      } catch {
        setUser(null);
        setLoggedIn(false);
      } finally {
        setAuthReady(true); 
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, setLoggedIn, authReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx || { user: null, isLoggedIn: false, setLoggedIn: () => {}, authReady: false };
}

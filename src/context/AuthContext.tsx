import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { isAuthenticated, getToken } from "../services/api";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuth: boolean;
  setUser: (user: User | null) => void;
  setAuthToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getToken());
  const isAuth = isAuthenticated();

  useEffect(() => {
    // Au chargement, vérifier si on a un token
    const storedToken = getToken();
    if (storedToken) {
      setToken(storedToken);
      // Optionnel : fetch les infos user depuis l'API
    }
  }, []);

  const setAuthToken = (newToken: string | null) => {
    setToken(newToken);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuth, setUser, setAuthToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

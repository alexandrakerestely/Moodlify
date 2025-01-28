import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../api/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      
      try {
        const userData = await authService.checkToken();
        if (userData) {
          setUser({ email: userData.email, role: userData.role });
          
        } else {

          setUser(null);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
      setLoading(false);
    };

    
    validateToken();
  }, []);

  const login = async (email, password) => {
    const token = await authService.login(email, password);

    if (token.success) {
        const userData = await authService.checkToken();
        const userInfo = { email: userData.email, role: userData.role };
        setUser(userInfo);
        return true;
    }
    
    return false;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// lib/hooks/useAuth.js
import { useEffect, useState } from "react";
import { authServices } from "@/lib/services/auth";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authServices.getAuthenticatUser();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return isAuthenticated;
};
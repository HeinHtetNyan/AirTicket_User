import { createContext, useState, useCallback, useEffect } from "react";
import { loginUser, registerUser } from "../utils/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.removeItem("authToken");
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);
      const authToken = data.token || data.access_token;

      if (!authToken) throw new Error("Token not found in response");

      localStorage.setItem("authToken", authToken);
      setToken(authToken);
      setUser(data.user || { email });

      return data;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError("");

    try {
      const data = await registerUser(payload);
      return data;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
    setError("");
  }, []);

  const value = { user, token, loading, error, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
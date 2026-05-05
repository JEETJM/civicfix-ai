import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  getMyProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("civicfix_user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem("civicfix_user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getSavedUser);
  const [token, setToken] = useState(() =>
    localStorage.getItem("civicfix_token")
  );
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user && token);

  const saveAuth = useCallback((authData) => {
    localStorage.setItem("civicfix_token", authData.token);
    localStorage.setItem("civicfix_user", JSON.stringify(authData.user));

    setToken(authData.token);
    setUser(authData.user);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem("civicfix_token");
    localStorage.removeItem("civicfix_user");

    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (credentials, options = {}) => {
      const data = await loginUser(credentials);

      saveAuth(data);

      if (!options.silent) {
        toast.success("Login successful");
      }

      return data.user;
    },
    [saveAuth]
  );

  const register = useCallback(
    async (userData, options = {}) => {
      const data = await registerUser(userData);

      saveAuth(data);

      if (!options.silent) {
        toast.success("Registration successful");
      }

      return data.user;
    },
    [saveAuth]
  );

  const logout = useCallback(
    async (options = {}) => {
      try {
        await logoutUser();
      } catch {
        // ignore logout API error
      }

      clearAuth();

      if (!options.silent) {
        toast.success("Logged out successfully");
      }
    },
    [clearAuth]
  );

  const refreshProfile = useCallback(async () => {
    const savedToken = localStorage.getItem("civicfix_token");

    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const data = await getMyProfile();
      setUser(data.user);
      localStorage.setItem("civicfix_user", JSON.stringify(data.user));
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [
      user,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
};
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { authApi, clearAuthToken, setAuthToken } from "../services/api";

const AuthContext = createContext();

const TOKEN_STORAGE_KEY = "@MedInventoryApp:access_token";

const normalizeUser = (apiUser) => {
  if (!apiUser) return null;

  const fallbackName =
    apiUser.fullName ||
    apiUser.username ||
    (typeof apiUser.email === "string"
      ? apiUser.email.split("@")[0]
      : undefined);

  return {
    ...apiUser,
    name: apiUser.name || fallbackName || "",
  };
};

const extractErrorMessage = (error) => {
  const possibleMessage =
    error?.message || error?.data?.message || error?.data?.error || error?.data;

  if (Array.isArray(possibleMessage)) {
    return possibleMessage.join("\n");
  }

  if (typeof possibleMessage === "string") {
    return possibleMessage;
  }

  return "Ocorreu um erro. Tente novamente.";
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    const loadStoredSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        if (!storedToken) {
          return;
        }

        setAuthToken(storedToken);
        setToken(storedToken);

        try {
          const profile = normalizeUser(await authApi.me());
          if (profile) {
            setUser(profile);
          } else {
            await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
            clearAuthToken();
            setToken(null);
          }
        } catch (error) {
          await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
          clearAuthToken();
          setToken(null);
        }
      } catch (error) {
        console.error("Erro ao carregar sessão armazenada:", error);
      } finally {
        setInitializing(false);
      }
    };

    loadStoredSession();
  }, []);

  const handleLogin = async (identifier, password) => {
    setAuthenticating(true);
    try {
      const response = await authApi.login({
        username: identifier?.trim(),
        password,
      });

      const accessToken = response?.access_token;
      const userData = normalizeUser(response?.user);

      if (!accessToken || !userData) {
        throw new Error("Resposta de autenticação inválida");
      }

      setAuthToken(accessToken);
      setToken(accessToken);
      setUser(userData);

      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, accessToken);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Erro ao fazer login:", error);

      return {
        success: false,
        error:
          extractErrorMessage(error) ||
          "Não foi possível realizar o login. Verifique suas credenciais.",
      };
    } finally {
      setAuthenticating(false);
    }
  };

  const handleSignup = async (payload) => {
    setAuthenticating(true);
    try {
      const response = await authApi.register({
        nome: payload.nome?.trim(),
        username: payload.username?.trim(),
        email: payload.email,
        password: payload.password,
        tipo: payload.tipo ?? "UsuarioComum",
      });
      const userData = normalizeUser(response?.user);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Erro ao criar conta:", error);

      return {
        success: false,
        error:
          extractErrorMessage(error) ||
          "Não foi possível criar a conta. Tente novamente.",
      };
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao limpar token armazenado:", error);
    } finally {
      clearAuthToken();
      setToken(null);
      setUser(null);
    }
  };

  const handleUpdateProfile = async (updates) => {
    setAuthenticating(true);
    try {
      if (!user?.id) {
        throw new Error("Usuário não identificado para atualização");
      }

      const response = await authApi.updateUser(user.id, updates);
      const updatedUserData = normalizeUser(response?.user ?? response);

      if (updatedUserData) {
        setUser((prev) => ({
          ...prev,
          ...updatedUserData,
        }));
      } else {
        const refreshed = normalizeUser(await authApi.me());
        setUser(refreshed);
      }

      return { success: true, user: updatedUserData };
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return {
        success: false,
        error:
          extractErrorMessage(error) || "Não foi possível atualizar o perfil.",
      };
    } finally {
      setAuthenticating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      return { success: false, error: "Usuário não encontrado." };
    }

    setAuthenticating(true);
    try {
      await authApi.deleteUser(user.id);
      await handleLogout();
      return { success: true };
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      return {
        success: false,
        error:
          extractErrorMessage(error) || "Não foi possível excluir a conta.",
      };
    } finally {
      setAuthenticating(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      authenticating,
      login: handleLogin,
      signup: handleSignup,
      logout: handleLogout,
      updateProfile: handleUpdateProfile,
      deleteAccount: handleDeleteAccount,
      isAuthenticated: Boolean(user && token),
    }),
    [user, token, initializing, authenticating]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

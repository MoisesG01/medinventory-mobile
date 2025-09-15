import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simular banco de dados de usuários
  const [users, setUsers] = useState([
    {
      id: "1",
      email: "admin@medinventory.com",
      password: "123456",
      firstName: "João",
      lastName: "Silva",
      hospital: "Hospital Central",
      role: "Administrador",
      name: "João Silva",
    },
    {
      id: "2",
      email: "enfermeiro@medinventory.com",
      password: "123456",
      firstName: "Maria",
      lastName: "Santos",
      hospital: "Hospital Central",
      role: "Enfermeiro",
      name: "Maria Santos",
    },
  ]);

  useEffect(() => {
    // Simular verificação de autenticação
    const checkAuth = async () => {
      try {
        // Simular delay de verificação
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Por enquanto, vamos simular que não há usuário logado
        setUser(null);
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);

      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Validar credenciais
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          hospital: foundUser.hospital,
          role: foundUser.role,
        };
        setUser(userData);
        return { success: true, user: userData };
      } else {
        return { success: false, error: "Email ou senha incorretos" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Erro ao fazer login" };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);

      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Verificar se email já existe
      const existingUser = users.find((u) => u.email === userData.email);
      if (existingUser) {
        return { success: false, error: "Este email já está em uso" };
      }

      // Criar novo usuário
      const newUser = {
        id: (users.length + 1).toString(),
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        hospital: userData.hospital,
        role: userData.role,
        name: `${userData.firstName} ${userData.lastName}`,
      };

      // Adicionar ao "banco de dados"
      setUsers((prev) => [...prev, newUser]);

      // Fazer login automático
      const userDataForLogin = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        hospital: newUser.hospital,
        role: newUser.role,
      };

      setUser(userDataForLogin);
      return { success: true, user: userDataForLogin };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: "Erro ao criar conta" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

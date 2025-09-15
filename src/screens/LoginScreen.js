import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import theme from "../styles/theme";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        Alert.alert("Sucesso", "Login realizado com sucesso!");
        navigation.navigate("MainTabs");
      } else {
        Alert.alert("Erro", result.error || "Erro ao fazer login");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Funcionalidade em desenvolvimento");
  };

  const handleForgotPassword = () => {
    Alert.alert("Recuperar Senha", "Funcionalidade em desenvolvimento");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Ionicons name="medical" size={40} color={theme.colors.white} />
              </View>
              <Text style={styles.logoText}>MedInventory</Text>
              <Text style={styles.logoSubtext}>
                Sistema de Gestão de Ativos
              </Text>
            </View>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Bem-vindo de volta!</Text>
              <Text style={styles.formSubtitle}>
                Faça login para acessar sua conta
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu email"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua senha"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={theme.colors.gradients.primary}
                style={styles.loginButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <Text style={styles.loginButtonText}>Entrando...</Text>
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Entrar</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={theme.colors.white}
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
            >
              <Ionicons
                name="logo-google"
                size={20}
                color={theme.colors.error}
              />
              <Text style={styles.googleButtonText}>Continuar com Google</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Não tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: height * 0.35,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.white + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  logoText: {
    fontSize: theme.typography.fontSize.xxxl,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  logoSubtext: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white + "CC",
    fontWeight: theme.typography.fontWeight.medium,
  },
  formContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.xxl,
    borderTopRightRadius: theme.borderRadius.xxl,
    marginTop: -theme.borderRadius.xxl,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  formHeader: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  formTitle: {
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
  formSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
  },
  passwordToggle: {
    padding: theme.spacing.sm,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: theme.spacing.xl,
  },
  forgotPasswordText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  loginButton: {
    marginBottom: theme.spacing.lg,
  },
  loginButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  loginButtonText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gray300,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  googleButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  signupLink: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default LoginScreen;

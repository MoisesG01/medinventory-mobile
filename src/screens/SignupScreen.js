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

const SignupScreen = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    hospital: "",
    role: "",
    phone: "",
    department: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigation = useNavigation();
  const { signup } = useAuth();

  const formatPhone = (value) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");

    // Aplica a máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
        6
      )}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: "Muito fraca", color: theme.colors.error };
      case 2:
        return { text: "Fraca", color: "#FF9800" };
      case 3:
        return { text: "Boa", color: "#FFC107" };
      case 4:
        return { text: "Forte", color: theme.colors.success };
      default:
        return { text: "", color: theme.colors.textSecondary };
    }
  };

  const handleInputChange = (field, value) => {
    let processedValue = value;

    // Formatar telefone
    if (field === "phone") {
      processedValue = formatPhone(value);
    }

    // Calcular força da senha
    if (field === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));

    // Limpar erro quando usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateField = (field, value) => {
    switch (field) {
      case "firstName":
        return value.trim() ? "" : "Nome é obrigatório";
      case "lastName":
        return value.trim() ? "" : "Sobrenome é obrigatório";
      case "email":
        if (!value.trim()) return "Email é obrigatório";
        if (!value.includes("@")) return "Email inválido";
        if (!value.includes(".")) return "Email inválido";
        return "";
      case "password":
        if (!value) return "Senha é obrigatória";
        if (value.length < 6) return "Senha deve ter pelo menos 6 caracteres";
        if (!/(?=.*[a-z])/.test(value))
          return "Senha deve conter pelo menos uma letra minúscula";
        if (!/(?=.*[A-Z])/.test(value))
          return "Senha deve conter pelo menos uma letra maiúscula";
        if (!/(?=.*\d)/.test(value))
          return "Senha deve conter pelo menos um número";
        return "";
      case "confirmPassword":
        if (!value) return "Confirmação de senha é obrigatória";
        if (value !== formData.password) return "Senhas não coincidem";
        return "";
      case "hospital":
        return value.trim() ? "" : "Hospital/Instituição é obrigatório";
      case "role":
        return value.trim() ? "" : "Cargo/Função é obrigatório";
      case "phone":
        if (value && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value))
          return "Telefone inválido (formato: (XX) XXXXX-XXXX)";
        return "";
      case "department":
        return value.trim() ? "" : "Departamento é obrigatório";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    if (!acceptTerms) {
      newErrors.terms = "Você deve aceitar os termos de uso";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await signup(formData);
      if (result.success) {
        Alert.alert("Sucesso", "Conta criada com sucesso!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("MainTabs"),
          },
        ]);
      } else {
        Alert.alert("Erro", result.error || "Erro ao criar conta");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    "Administrador",
    "Enfermeiro",
    "Médico",
    "Técnico",
    "Gerente",
    "Supervisor",
  ];

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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.colors.white}
              />
            </TouchableOpacity>
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

          {/* Signup Form */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Criar Conta</Text>
              <Text style={styles.formSubtitle}>
                Preencha os dados para criar sua conta
              </Text>
            </View>

            {/* Nome e Sobrenome */}
            <View style={styles.rowContainer}>
              <View
                style={[
                  styles.inputContainer,
                  { flex: 1, marginRight: theme.spacing.sm },
                ]}
              >
                <Text style={styles.inputLabel}>Nome</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={formData.firstName}
                    onChangeText={(value) =>
                      handleInputChange("firstName", value)
                    }
                    autoCapitalize="words"
                  />
                </View>
              </View>
              <View
                style={[
                  styles.inputContainer,
                  { flex: 1, marginLeft: theme.spacing.sm },
                ]}
              >
                <Text style={styles.inputLabel}>Sobrenome</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Sobrenome"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={formData.lastName}
                    onChangeText={(value) =>
                      handleInputChange("lastName", value)
                    }
                    autoCapitalize="words"
                  />
                </View>
              </View>
            </View>

            {/* Email */}
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
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.password && styles.inputError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    errors.password
                      ? theme.colors.error
                      : theme.colors.textSecondary
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Crie uma senha"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
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
              {formData.password && (
                <View style={styles.passwordStrengthContainer}>
                  <View style={styles.passwordStrengthBars}>
                    {[1, 2, 3, 4].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.passwordStrengthBar,
                          passwordStrength >= level && {
                            backgroundColor:
                              getPasswordStrengthText(passwordStrength).color,
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text
                    style={[
                      styles.passwordStrengthText,
                      {
                        color: getPasswordStrengthText(passwordStrength).color,
                      },
                    ]}
                  >
                    {getPasswordStrengthText(passwordStrength).text}
                  </Text>
                </View>
              )}
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Confirmar Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirmar Senha</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.confirmPassword && styles.inputError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    errors.confirmPassword
                      ? theme.colors.error
                      : theme.colors.textSecondary
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirme sua senha"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.passwordToggle}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Hospital */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Hospital/Instituição</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="business-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nome do hospital ou instituição"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.hospital}
                  onChangeText={(value) => handleInputChange("hospital", value)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Cargo e Departamento */}
            <View style={styles.rowContainer}>
              <View
                style={[
                  styles.inputContainer,
                  { flex: 1, marginRight: theme.spacing.sm },
                ]}
              >
                <Text style={styles.inputLabel}>Cargo/Função</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.role && styles.inputError,
                  ]}
                >
                  <Ionicons
                    name="briefcase-outline"
                    size={20}
                    color={
                      errors.role
                        ? theme.colors.error
                        : theme.colors.textSecondary
                    }
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Seu cargo"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={formData.role}
                    onChangeText={(value) => handleInputChange("role", value)}
                    autoCapitalize="words"
                  />
                </View>
                {errors.role && (
                  <Text style={styles.errorText}>{errors.role}</Text>
                )}
              </View>
              <View
                style={[
                  styles.inputContainer,
                  { flex: 1, marginLeft: theme.spacing.sm },
                ]}
              >
                <Text style={styles.inputLabel}>Departamento</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.department && styles.inputError,
                  ]}
                >
                  <Ionicons
                    name="business-outline"
                    size={20}
                    color={
                      errors.department
                        ? theme.colors.error
                        : theme.colors.textSecondary
                    }
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Departamento"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={formData.department}
                    onChangeText={(value) =>
                      handleInputChange("department", value)
                    }
                    autoCapitalize="words"
                  />
                </View>
                {errors.department && (
                  <Text style={styles.errorText}>{errors.department}</Text>
                )}
              </View>
            </View>

            {/* Telefone */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Telefone (Opcional)</Text>
              <View
                style={[styles.inputWrapper, errors.phone && styles.inputError]}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={
                    errors.phone
                      ? theme.colors.error
                      : theme.colors.textSecondary
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="(XX) XXXXX-XXXX"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange("phone", value)}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>

            {/* Termos de Uso */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => {
                setAcceptTerms(!acceptTerms);
                if (errors.terms) {
                  setErrors((prev) => ({ ...prev, terms: "" }));
                }
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptTerms && styles.checkboxChecked,
                  errors.terms && styles.checkboxError,
                ]}
              >
                {acceptTerms && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={theme.colors.white}
                  />
                )}
              </View>
              <Text style={styles.termsText}>
                Eu aceito os <Text style={styles.termsLink}>Termos de Uso</Text>{" "}
                e <Text style={styles.termsLink}>Política de Privacidade</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && (
              <Text style={styles.errorText}>{errors.terms}</Text>
            )}

            {/* Botão de Cadastro */}
            <TouchableOpacity
              style={[
                styles.signupButton,
                (!acceptTerms || loading) && styles.signupButtonDisabled,
              ]}
              onPress={handleSignup}
              disabled={loading || !acceptTerms}
            >
              <LinearGradient
                colors={
                  acceptTerms
                    ? theme.colors.gradients.primary
                    : [theme.colors.gray300, theme.colors.gray300]
                }
                style={styles.signupButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <Text style={styles.signupButtonText}>Criando conta...</Text>
                ) : (
                  <>
                    <Text style={styles.signupButtonText}>Criar Conta</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={theme.colors.white}
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Faça login</Text>
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
    height: height * 0.3,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: theme.spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: theme.borderRadius.full,
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
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.xl,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.gray300,
    marginRight: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxError: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  termsText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  signupButton: {
    marginBottom: theme.spacing.lg,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  signupButtonText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  inputError: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  passwordStrengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  passwordStrengthBars: {
    flexDirection: "row",
    marginRight: theme.spacing.sm,
  },
  passwordStrengthBar: {
    width: 20,
    height: 4,
    backgroundColor: theme.colors.gray300,
    marginRight: 4,
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default SignupScreen;

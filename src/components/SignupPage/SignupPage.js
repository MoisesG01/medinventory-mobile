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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");

const SignupPage = () => {
  const [formData, setFormData] = useState({
    nome: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { signup } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    return strength;
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignup = async () => {
    if (!agreeToTerms) {
      Alert.alert(
        "Erro",
        "Por favor, aceite os Termos de Serviço e Política de Privacidade"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    const normalizedUsername = formData.username.trim();
    const normalizedName = formData.nome.trim();

    if (!normalizedName) {
      Alert.alert("Erro", "Informe o nome completo");
      return;
    }

    if (normalizedName.length < 2) {
      Alert.alert("Erro", "Nome deve ter pelo menos 2 caracteres.");
      return;
    }

    if (normalizedName.length > 100) {
      Alert.alert("Erro", "Nome deve ter no máximo 100 caracteres.");
      return;
    }

    if (!normalizedUsername || !formData.email.trim()) {
      Alert.alert("Erro", "Preencha nome de usuário e email");
      return;
    }

    if (normalizedUsername.length < 3) {
      Alert.alert("Erro", "Nome de usuário deve ter pelo menos 3 caracteres.");
      return;
    }

    if (normalizedUsername.length > 30) {
      Alert.alert("Erro", "Nome de usuário deve ter no máximo 30 caracteres.");
      return;
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(normalizedUsername)) {
      Alert.alert(
        "Erro",
        "Use apenas letras, números, ponto, traço e sublinhado no nome de usuário."
      );
      return;
    }

    setLoading(true);
    try {
      const result = await signup({
        nome: normalizedName,
        username: normalizedUsername,
        email: formData.email.trim(),
        password: formData.password,
        tipo: "UsuarioComum",
      });
      if (result.success) {
        Alert.alert("Sucesso", "Conta criada com sucesso!", [
          {
            text: "OK",
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              }),
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

  const handleGoogleSignup = () => {
    console.log("Google signup");
  };

  const handleEmailSignup = () => {
    console.log("Email signup");
  };

  const renderPasswordStrengthDots = () => {
    return (
      <View style={styles.strengthContainer}>
        <Text style={styles.strengthLabel}>Password strength:</Text>
        <View style={styles.strengthDots}>
          {[1, 2, 3, 4].map((level) => (
            <View
              key={level}
              style={[
                styles.strengthDot,
                passwordStrength >= level && styles.strengthDotStrong,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderValidationItem = (text, isValid) => (
    <View style={styles.validationItem}>
      <Ionicons
        name={isValid ? "checkmark-circle" : "ellipse-outline"}
        size={16}
        color={isValid ? "#4CAF50" : "#ccc"}
      />
      <Text
        style={[styles.validationText, isValid && styles.validationTextValid]}
      >
        {text}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.signupContainer}>
        <Text style={styles.signupTitle}>Create an account</Text>

        <View style={styles.signupFields}>
          <View style={styles.signupField}>
            <Text style={styles.label}>Full Name*</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#ccc"
              value={formData.nome}
              onChangeText={(value) => handleInputChange("nome", value)}
            />
          </View>

          <View style={styles.signupField}>
            <Text style={styles.label}>Username*</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose a username"
              placeholderTextColor="#ccc"
              value={formData.username}
              onChangeText={(value) => handleInputChange("username", value)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.signupField}>
            <Text style={styles.label}>Email*</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#ccc"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          >
            <Ionicons
              name={agreeToTerms ? "checkbox" : "square-outline"}
              size={20}
              color={agreeToTerms ? "#007BFF" : "#ccc"}
            />
            <Text style={styles.checkboxText}>
              By creating an account, I agree to our{" "}
              <Text
                style={styles.termLink}
                onPress={() => navigation.navigate("Terms")}
              >
                Terms of use
              </Text>{" "}
              and{" "}
              <Text
                style={styles.termLink}
                onPress={() => navigation.navigate("Terms")}
              >
                Privacy Policy
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.passwordSection}>
          <Text style={styles.passwordMustHave}>Password must have:</Text>

          <View style={styles.signupField}>
            <Text style={styles.label}>Password*</Text>
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#ccc"
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={toggleShowPassword}
                style={styles.togglePassword}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#007BFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.signupField}>
            <Text style={styles.label}>Confirm Password*</Text>
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#ccc"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={toggleShowConfirmPassword}
                style={styles.togglePassword}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#007BFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.passwordValidation}>
            <Text style={styles.validationTitle}>Password validation:</Text>
            {renderValidationItem(
              "8 characters or more",
              passwordStrength >= 1
            )}
            {renderValidationItem(
              "At least one special character",
              passwordStrength >= 2
            )}
            {renderValidationItem("At least one number", passwordStrength >= 3)}
            {renderValidationItem(
              "At least one upper case character",
              passwordStrength >= 4
            )}
          </View>

          {renderPasswordStrengthDots()}
        </View>

        <Text style={styles.mandatoryText}>* Mandatory fields</Text>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup}
          disabled={loading}
        >
          <LinearGradient
            colors={["#91B3FA", "#797AE0"]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.signupButtonText}>
              {loading ? "Criando Conta..." : "Create Account"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.signupVia}>
          <Text style={styles.signupViaTitle}>Sign up via:</Text>
          <View style={styles.signupViaIcons}>
            <TouchableOpacity onPress={handleGoogleSignup}>
              <Ionicons name="logo-google" size={30} color="#4285F4" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEmailSignup}>
              <Ionicons name="mail-outline" size={30} color="#007BFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.alreadyHaveAccount}>
          <Text style={styles.alreadyHaveAccountText}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  signupContainer: {
    backgroundColor: "rgba(8, 7, 63, 0.7)",
    padding: 40,
    borderRadius: 10,
    margin: 20,
    marginTop: 80,
    marginBottom: 30,
    color: "#b3b0b0",
  },
  signupTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  signupFields: {
    gap: 20,
  },
  signupField: {
    gap: 10,
  },
  label: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    backgroundColor: "rgba(229, 229, 230, 0.17)",
    color: "#fff",
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 10,
  },
  checkboxText: {
    color: "#b3b0b0",
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  termLink: {
    color: "#ccc",
    textDecorationLine: "underline",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#fff",
    opacity: 0.2,
    marginVertical: 20,
  },
  passwordSection: {
    backgroundColor: "rgba(200, 200, 200, 0.2)",
    padding: 20,
    borderRadius: 8,
  },
  passwordMustHave: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  passwordInputWrapper: {
    position: "relative",
  },
  togglePassword: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 1,
  },
  passwordValidation: {
    marginTop: 20,
    gap: 10,
  },
  validationTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  validationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  validationText: {
    color: "#ccc",
    fontSize: 14,
  },
  validationTextValid: {
    color: "#4CAF50",
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 15,
  },
  strengthLabel: {
    color: "#fff",
    fontSize: 14,
  },
  strengthDots: {
    flexDirection: "row",
    gap: 8,
  },
  strengthDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ccc",
  },
  strengthDotStrong: {
    backgroundColor: "#4CAF50",
  },
  mandatoryText: {
    color: "#b3b0b0",
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
  },
  signupButton: {
    width: "100%",
    marginTop: 20,
  },
  gradientButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupVia: {
    alignItems: "center",
    marginTop: 30,
  },
  signupViaTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  signupViaIcons: {
    flexDirection: "row",
    gap: 20,
  },
  alreadyHaveAccount: {
    alignItems: "center",
    marginTop: 30,
  },
  alreadyHaveAccountText: {
    color: "#b3b0b0",
    fontSize: 16,
    marginBottom: 10,
  },
  loginLink: {
    color: "#ccc",
    fontSize: 18,
    textDecorationLine: "underline",
  },
});

export default SignupPage;

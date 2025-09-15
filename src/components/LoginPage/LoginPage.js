import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        navigation.navigate("Home");
      } else {
        Alert.alert("Erro", result.error || "Erro ao fazer login");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Implementar login com Google
    console.log("Google signup");
  };

  const handleEmailSignup = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        {/* Signup Section */}
        <View style={styles.signupSection}>
          <Text style={styles.sectionTitle}>Sign up</Text>

          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleSignup}
          >
            <Ionicons name="logo-google" size={20} color="#000" />
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.emailBtn} onPress={handleEmailSignup}>
            <Ionicons name="mail-outline" size={20} color="#000" />
            <Text style={styles.emailBtnText}>Sign up with email</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By signing up, you agree to the{" "}
            <Text
              style={styles.termLink}
              onPress={() => navigation.navigate("Terms")}
            >
              Terms of Service
            </Text>{" "}
            and acknowledge you've read our{" "}
            <Text
              style={styles.termLink}
              onPress={() => navigation.navigate("Terms")}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Login Section */}
        <View style={styles.loginSection}>
          <Text style={styles.sectionTitle}>Log in</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#ccc"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#ccc"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#ccc"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#ccc"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
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

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={["#91B3FA", "#797AE0"]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.loginBtnText}>
                {loading ? "Entrando..." : "Log in"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  loginContainer: {
    backgroundColor: "rgba(8, 7, 63, 0.7)",
    padding: 40,
    borderRadius: 10,
    flexDirection: width > 768 ? "row" : "column",
    gap: 30,
    maxWidth: 800,
    width: "100%",
    color: "#fff",
    paddingLeft: 60,
    paddingRight: 50,
  },
  signupSection: {
    flex: 1,
    alignItems: "center",
    maxWidth: 300,
  },
  loginSection: {
    flex: 1,
    alignItems: "center",
    maxWidth: 300,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 15,
    marginTop: 10,
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  googleBtnText: {
    color: "#000",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  emailBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 15,
    marginTop: 10,
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  emailBtnText: {
    color: "#000",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  termsText: {
    fontSize: 13,
    color: "#ebe5e5",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 18,
  },
  termLink: {
    color: "#ccc",
    textDecorationLine: "underline",
  },
  divider: {
    width: width > 768 ? 1 : "100%",
    height: width > 768 ? "100%" : 1,
    backgroundColor: "#fff",
    opacity: 0.2,
    margin: width > 768 ? "0 20px" : "20px 0",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    color: "#fff",
    marginBottom: 5,
    fontSize: 14,
  },
  inputWithIcon: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 10,
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#fff",
    fontSize: 16,
  },
  inputIcon: {
    position: "absolute",
    left: 10,
    top: 12,
    zIndex: 1,
  },
  togglePassword: {
    position: "absolute",
    right: 10,
    top: 12,
    zIndex: 1,
  },
  loginBtn: {
    width: "100%",
    marginBottom: 15,
  },
  gradientButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: "#9AC7FF",
    fontSize: 14,
  },
});

export default LoginPage;

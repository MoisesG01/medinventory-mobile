import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) {
      alert("Por favor, insira seu email");
      return;
    }

    // Implementar lógica de inscrição
    console.log("Newsletter subscription:", email);
    alert("Obrigado por se inscrever!");
    setEmail("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Fique por dentro das novidades</Text>
          <Text style={styles.description}>
            Receba atualizações sobre novas funcionalidades, dicas e ofertas
            especiais
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={handleSubscribe}
          >
            <LinearGradient
              colors={["#646cff", "#4c63d2"]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.subscribeButtonText}>Inscrever-se</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "#646cff",
  },
  content: {
    alignItems: "center",
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#e8f0fe",
    textAlign: "center",
    lineHeight: 24,
  },
  formContainer: {
    flexDirection: width > 768 ? "row" : "column",
    width: "100%",
    gap: 16,
  },
  inputContainer: {
    flex: 1,
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 1,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    paddingLeft: 48,
    fontSize: 16,
    color: "#191919",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  subscribeButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  subscribeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NewsletterSection;

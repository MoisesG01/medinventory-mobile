import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const HighlightsSection = () => {
  const highlights = [
    {
      icon: "shield-checkmark-outline",
      title: "Segurança Garantida",
      description: "Seus dados protegidos com criptografia de ponta",
    },
    {
      icon: "speedometer-outline",
      title: "Performance Otimizada",
      description: "Sistema rápido e responsivo para máxima produtividade",
    },
    {
      icon: "people-outline",
      title: "Suporte Especializado",
      description: "Equipe dedicada para ajudar no seu sucesso",
    },
    {
      icon: "trending-up-outline",
      title: "Crescimento Contínuo",
      description: "Atualizações regulares com novas funcionalidades",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Destaques</Text>
        <Text style={styles.title}>Por que escolher o MedInventory?</Text>
      </View>

      <View style={styles.highlightsContainer}>
        {highlights.map((highlight, index) => (
          <View key={index} style={styles.highlightBox}>
            <View style={styles.iconContainer}>
              <Ionicons name={highlight.icon} size={32} color="#646cff" />
            </View>
            <Text style={styles.highlightTitle}>{highlight.title}</Text>
            <Text style={styles.highlightDescription}>
              {highlight.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "#f8f9fa",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    color: "#646cff",
    fontWeight: "600",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#191919",
    textAlign: "center",
    lineHeight: 32,
  },
  highlightsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
  },
  highlightBox: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    width: width > 768 ? (width - 80) / 2 : width - 40,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: "#e8f0fe",
    borderRadius: 50,
    padding: 16,
    marginBottom: 16,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#191919",
    marginBottom: 8,
    textAlign: "center",
  },
  highlightDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default HighlightsSection;

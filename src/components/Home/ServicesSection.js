import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ServicesSection = () => {
  const services = [
    {
      icon: "location-outline",
      title: "Rastreabilidade",
      description: "Controle a rastreabilidade de forma fácil e eficiente.",
    },
    {
      icon: "settings-outline",
      title: "Gestão de Inventário",
      description: "Controle e rastreamento de todos os seus ativos.",
    },
    {
      icon: "people-outline",
      title: "Atendimento ao Cliente",
      description: "Suporte dedicado para resolver suas dúvidas.",
    },
    {
      icon: "clipboard-outline",
      title: "Relatórios Detalhados",
      description: "Gere relatórios personalizados para melhor análise.",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Serviços</Text>
        <Text style={styles.title}>
          O sistema de gestão MedInventory é completo para atender diversos
          segmentos do setor da saúde.
        </Text>
      </View>

      <View style={styles.servicesContainer}>
        {services.map((service, index) => (
          <View key={index} style={styles.serviceBox}>
            <View style={styles.iconContainer}>
              <Ionicons name={service.icon} size={32} color="#646cff" />
            </View>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
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
    backgroundColor: "#ffffff",
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
    maxWidth: 800,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
  },
  serviceBox: {
    backgroundColor: "#f8f9fa",
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
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#191919",
    marginBottom: 8,
    textAlign: "center",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default ServicesSection;

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const PlansSection = () => {
  const plans = [
    {
      name: "Básico",
      price: "R$ 29",
      period: "/mês",
      features: ["Até 100 ativos", "Suporte por email", "Relatórios básicos"],
      popular: false,
    },
    {
      name: "Profissional",
      price: "R$ 59",
      period: "/mês",
      features: [
        "Até 500 ativos",
        "Suporte prioritário",
        "Relatórios avançados",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Empresarial",
      price: "R$ 99",
      period: "/mês",
      features: [
        "Ativos ilimitados",
        "Suporte 24/7",
        "Relatórios customizados",
        "Integração completa",
      ],
      popular: false,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Planos</Text>
        <Text style={styles.title}>
          Escolha o plano ideal para o seu negócio
        </Text>
      </View>

      <View style={styles.plansContainer}>
        {plans.map((plan, index) => (
          <View
            key={index}
            style={[styles.planBox, plan.popular && styles.popularPlan]}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Mais Popular</Text>
              </View>
            )}

            <Text style={styles.planName}>{plan.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{plan.price}</Text>
              <Text style={styles.period}>{plan.period}</Text>
            </View>

            <View style={styles.featuresContainer}>
              {plan.features.map((feature, featureIndex) => (
                <View key={featureIndex} style={styles.feature}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.selectButton,
                plan.popular && styles.popularButton,
              ]}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  plan.popular && styles.popularButtonText,
                ]}
              >
                Selecionar Plano
              </Text>
            </TouchableOpacity>
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
  plansContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  planBox: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    width: width > 768 ? 280 : width - 40,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
  },
  popularPlan: {
    borderWidth: 2,
    borderColor: "#646cff",
    transform: [{ scale: 1.05 }],
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    backgroundColor: "#646cff",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  planName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#191919",
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 24,
  },
  price: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#646cff",
  },
  period: {
    fontSize: 16,
    color: "#666",
    marginLeft: 4,
  },
  featuresContainer: {
    width: "100%",
    marginBottom: 24,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  selectButton: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  popularButton: {
    backgroundColor: "#646cff",
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#191919",
  },
  popularButtonText: {
    color: "#ffffff",
  },
});

export default PlansSection;

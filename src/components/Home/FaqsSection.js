import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const FaqsSection = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: "Como funciona o sistema MedInventory?",
      answer:
        "O MedInventory é um sistema completo de gestão de ativos que permite controlar, rastrear e monitorar todos os seus equipamentos e inventário em uma única plataforma.",
    },
    {
      question: "Posso integrar com outros sistemas?",
      answer:
        "Sim, oferecemos APIs e integrações com os principais sistemas do mercado para facilitar a migração e sincronização de dados.",
    },
    {
      question: "Qual é o suporte oferecido?",
      answer:
        "Oferecemos suporte por email, chat e telefone, com diferentes níveis de atendimento conforme o plano escolhido.",
    },
    {
      question: "Os dados são seguros?",
      answer:
        "Sim, utilizamos criptografia de ponta e seguimos as melhores práticas de segurança para proteger seus dados.",
    },
    {
      question: "Posso testar antes de comprar?",
      answer:
        "Oferecemos um período de teste gratuito de 14 dias para você conhecer todas as funcionalidades do sistema.",
    },
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>FAQ</Text>
        <Text style={styles.title}>Perguntas Frequentes</Text>
        <Text style={styles.description}>
          Encontre respostas para as dúvidas mais comuns sobre o MedInventory
        </Text>
      </View>

      <View style={styles.faqsContainer}>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.faqQuestion}
              onPress={() => toggleFaq(index)}
            >
              <Text style={styles.questionText}>{faq.question}</Text>
              <Ionicons
                name={expandedFaq === index ? "chevron-up" : "chevron-down"}
                size={20}
                color="#646cff"
              />
            </TouchableOpacity>

            {expandedFaq === index && (
              <View style={styles.faqAnswer}>
                <Text style={styles.answerText}>{faq.answer}</Text>
              </View>
            )}
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
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 600,
  },
  faqsContainer: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  faqItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#191919",
    flex: 1,
    marginRight: 16,
  },
  faqAnswer: {
    padding: 20,
    paddingTop: 0,
  },
  answerText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

export default FaqsSection;

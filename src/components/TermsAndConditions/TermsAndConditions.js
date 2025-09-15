import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const termsData = [
  {
    title: "Introduction",
    content:
      "Welcome to MedInventory. By accessing or using our service, you agree to be bound by these terms and conditions. Please read them carefully before proceeding.",
  },
  {
    title: "Use of Service",
    content:
      "You are responsible for any activity that occurs under your account. Ensure that your use complies with all applicable laws. Unauthorized use or abuse of our services will lead to immediate termination.",
  },
  {
    title: "Account Responsibilities",
    content:
      "You must maintain the confidentiality of your account and password. Notify us immediately if there is any unauthorized use of your account. We are not responsible for any losses caused by unauthorized use of your account.",
  },
  {
    title: "Limitations of Liability",
    content:
      "MedInventory will not be liable for any indirect, incidental, or consequential damages arising from your use of our services. We provide no warranties as to the performance or outcomes from using our software.",
  },
  {
    title: "Modifications to Terms",
    content:
      "We reserve the right to modify these terms at any time. Continued use of the service implies acceptance of the modified terms. Please review this page periodically for updates.",
  },
  {
    title: "Termination",
    content:
      "MedInventory may terminate your access if you breach these terms. Upon termination, your rights to use our services will cease immediately.",
  },
];

const TermsAndConditions = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.subtitle}>
          Please read our terms and conditions carefully before using
          MedInventory.
        </Text>

        {termsData.map((section, index) => (
          <View key={index} style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(index)}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Ionicons
                name={expandedSection === index ? "chevron-up" : "chevron-down"}
                size={20}
                color="#646cff"
              />
            </TouchableOpacity>

            {expandedSection === index && (
              <View style={styles.sectionContent}>
                <Text style={styles.sectionText}>{section.content}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#191919",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  section: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#191919",
    flex: 1,
    marginRight: 16,
  },
  sectionContent: {
    padding: 20,
    paddingTop: 0,
  },
  sectionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
});

export default TermsAndConditions;

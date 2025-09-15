import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Footer = () => {
  const navigation = useNavigation();

  const socialIcons = [
    { name: "logo-instagram", color: "#E4405F" },
    { name: "logo-twitter", color: "#1DA1F2" },
    { name: "logo-youtube", color: "#FF0000" },
    { name: "globe-outline", color: "#666" },
  ];

  const companyLinks = [
    { label: "About us", screen: "Home" },
    { label: "Blog", screen: "Home" },
    { label: "Contact us", screen: "Home" },
    { label: "Pricing", screen: "Home" },
  ];

  const supportLinks = [
    { label: "Help Center", screen: "Home" },
    { label: "Terms of Service", screen: "Terms" },
    { label: "Legal", screen: "Terms" },
    { label: "Privacy policy", screen: "Terms" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>MedInventory</Text>
          </View>
          <Text style={styles.copyright}>Copyright © 2024 Cotia-Sp</Text>
          <Text style={styles.rights}>All rights reserved</Text>

          <View style={styles.socialIcons}>
            {socialIcons.map((icon, index) => (
              <TouchableOpacity key={index} style={styles.socialIcon}>
                <Ionicons name={icon.name} size={24} color={icon.color} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.linksSection}>
          <View style={styles.linkGroup}>
            <Text style={styles.linkGroupTitle}>Company</Text>
            {companyLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(link.screen)}
                style={styles.linkItem}
              >
                <Text style={styles.linkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.linkGroup}>
            <Text style={styles.linkGroupTitle}>Support</Text>
            {supportLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(link.screen)}
                style={styles.linkItem}
              >
                <Text style={styles.linkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#151D20",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: width > 768 ? "row" : "column",
    justifyContent: "space-between",
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  leftSection: {
    flex: 1,
    marginBottom: width > 768 ? 0 : 30,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 2,
  },
  copyright: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
  },
  rights: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 20,
  },
  socialIcons: {
    flexDirection: "row",
    gap: 16,
  },
  socialIcon: {
    padding: 8,
  },
  linksSection: {
    flexDirection: width > 768 ? "row" : "column",
    flex: 2,
    gap: width > 768 ? 40 : 20,
  },
  linkGroup: {
    flex: 1,
  },
  linkGroupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  linkItem: {
    marginBottom: 8,
  },
  linkText: {
    fontSize: 14,
    color: "#ccc",
  },
});

export default Footer;

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Navbar = () => {
  const navigation = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
    setIsMenuOpen(false);
  };

  const menuItems = [
    { name: "Home", screen: "Home" },
    { name: "About", screen: "Home" },
    { name: "Services", screen: "Home" },
    { name: "Plans", screen: "Home" },
    { name: "Help", screen: "Home" },
    { name: "Terms & Conditions", screen: "Terms" },
  ];

  return (
    <View style={styles.navbar}>
      <View style={styles.navbarContent}>
        <View style={styles.navbarLogo}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.navbarTitle}>MedInventory</Text>
        </View>

        {/* Desktop Menu */}
        <View style={styles.desktopMenu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigateToScreen(item.screen)}
            >
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.navbarButtons}>
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => navigateToScreen("Signup")}
          >
            <Ionicons name="person-outline" size={16} color="#fff" />
            <Text style={styles.buttonText}>SIGNUP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigateToScreen("Login")}
          >
            <Ionicons name="log-in-outline" size={16} color="#fff" />
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
        </View>

        {/* Mobile Menu Toggle */}
        <TouchableOpacity style={styles.menuToggle} onPress={toggleMenu}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
      </View>

      {/* Mobile Menu Modal */}
      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.mobileMenu}>
            <ScrollView style={styles.mobileMenuContent}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.mobileMenuItem}
                  onPress={() => navigateToScreen(item.screen)}
                >
                  <Text style={styles.mobileMenuText}>{item.name}</Text>
                </TouchableOpacity>
              ))}

              <View style={styles.mobileButtons}>
                <TouchableOpacity
                  style={styles.mobileSignupBtn}
                  onPress={() => navigateToScreen("Signup")}
                >
                  <Ionicons name="person-outline" size={16} color="#fff" />
                  <Text style={styles.mobileButtonText}>SIGNUP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.mobileLoginBtn}
                  onPress={() => navigateToScreen("Login")}
                >
                  <Ionicons name="log-in-outline" size={16} color="#fff" />
                  <Text style={styles.mobileButtonText}>LOGIN</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "#151D20",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  navbarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navbarLogo: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  logo: {
    height: 40,
    width: 40,
    marginRight: 10,
  },
  navbarTitle: {
    fontFamily: "Inter",
    fontSize: 24,
    letterSpacing: 5,
    fontWeight: "bold",
    color: "#fff",
  },
  desktopMenu: {
    flexDirection: "row",
    display: width > 768 ? "flex" : "none",
  },
  menuItem: {
    marginHorizontal: 15,
  },
  menuText: {
    fontFamily: "Inter",
    color: "#ffffff",
    fontSize: 16,
  },
  navbarButtons: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
    display: width > 768 ? "flex" : "none",
  },
  signupBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#333",
    borderRadius: 5,
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#333",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  menuToggle: {
    display: width > 768 ? "none" : "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
  },
  hamburgerLine: {
    width: 25,
    height: 3,
    backgroundColor: "#fff",
    marginVertical: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  mobileMenu: {
    backgroundColor: "#151D20",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    maxHeight: "80%",
  },
  mobileMenuContent: {
    flex: 1,
  },
  mobileMenuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  mobileMenuText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter",
  },
  mobileButtons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  mobileSignupBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#333",
    borderRadius: 5,
    flex: 0.45,
    justifyContent: "center",
  },
  mobileLoginBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#333",
    borderRadius: 5,
    flex: 0.45,
    justifyContent: "center",
  },
  mobileButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Navbar;

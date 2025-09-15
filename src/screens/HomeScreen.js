import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../components/Navbar/Navbar";
import HomeSection from "../components/Home/HomeSection";
import ServicesSection from "../components/Home/ServicesSection";
import PlansSection from "../components/Home/PlansSection";
import FaqsSection from "../components/Home/FaqsSection";
import HighlightsSection from "../components/Home/HighlightsSection";
import NewsletterSection from "../components/Home/NewsletterSection";
import Footer from "../components/Footer/Footer";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <HomeSection />
        <ServicesSection />
        <PlansSection />
        <FaqsSection />
        <HighlightsSection />
        <NewsletterSection />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
});

export default HomeScreen;

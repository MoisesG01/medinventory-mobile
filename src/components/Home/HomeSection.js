import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const HomeSection = () => {
  const [variant, setVariant] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const newVariant = Math.random() < 0.5 ? "A" : "B";
    setVariant(newVariant);
  }, []);

  const slides = [
    {
      id: 1,
      image: require("../../assets/images/image_4.png"),
      title: "Controle Total de Ativos",
      description:
        "Gerencie e monitore todos os seus ativos em um único lugar.",
    },
    {
      id: 2,
      image: require("../../assets/images/image_1.webp"),
      title: "Segurança e Confiabilidade",
      description: "Sua plataforma em cloud com foco em segurança.",
    },
    {
      id: 3,
      image: require("../../assets/images/image_3.webp"),
      title: "Soluções Personalizadas",
      description:
        "Adapte o sistema às suas necessidades específicas com facilidade.",
    },
  ];

  const benefits = [
    {
      icon: "desktop-outline",
      title: "Solução",
      description: "100% SaaS",
    },
    {
      icon: "cloud-upload-outline",
      title: "Plataforma",
      description: "em Cloud",
    },
    {
      icon: "star-outline",
      title: "Focado em",
      description: "Customer Success",
    },
    {
      icon: "lock-closed-outline",
      title: "Segurança",
      description: "para seu negócio",
    },
  ];

  const handleExploreClick = () => {
    navigation.navigate("Signup");
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!variant) return null;

  return (
    <View style={styles.container}>
      {/* Carousel */}
      <View style={styles.carousel}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setCurrentSlide(slideIndex);
          }}
          style={styles.carouselScroll}
        >
          {slides.map((slide, index) => (
            <View key={slide.id} style={styles.slide}>
              <Image
                source={slide.image}
                style={styles.slideImage}
                resizeMode="cover"
              />
              <View style={styles.slideCaption}>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideDescription}>{slide.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Carousel Navigation */}
        <View style={styles.carouselNavigation}>
          <TouchableOpacity onPress={prevSlide} style={styles.navButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.dots}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === currentSlide && styles.activeDot]}
              />
            ))}
          </View>
          <TouchableOpacity onPress={nextSlide} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Home Content */}
      <View style={[styles.homeContent, variant === "B" && styles.variantB]}>
        {variant === "A" ? (
          <>
            <Text style={styles.title}>
              Gerencie seus ativos com o sistema MedInventory
            </Text>
            <Text style={styles.description}>
              O software ideal para pequenos e médios negócios. Tenha todos os
              controles dos seus ativos em um único lugar.
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={handleExploreClick}
            >
              <LinearGradient
                colors={["#797ae0", "#18b86d"]}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.exploreButtonText}>Quero Conhecer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={[styles.title, styles.variantBTitle]}>
              Transforme a forma como você gerencia seus ativos
            </Text>
            <Text style={[styles.description, styles.variantBDescription]}>
              Agilidade, controle e praticidade em um sistema moderno feito para
              o seu crescimento.
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={handleExploreClick}
            >
              <LinearGradient
                colors={["#18b86d", "#005eff"]}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.exploreButtonText}>Começar Agora</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Benefits Section */}
      <View style={styles.benefitsSection}>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefit}>
            <Ionicons name={benefit.icon} size={32} color="#646cff" />
            <Text style={styles.benefitTitle}>{benefit.title}</Text>
            <Text style={styles.benefitDescription}>{benefit.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  carousel: {
    width: "100%",
    maxWidth: 1200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 30,
    position: "relative",
  },
  carouselScroll: {
    height: 200,
  },
  slide: {
    width: width - 40,
    height: 200,
    position: "relative",
  },
  slideImage: {
    width: "100%",
    height: "100%",
  },
  slideCaption: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  slideTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  slideDescription: {
    color: "#fff",
    fontSize: 14,
  },
  carouselNavigation: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  navButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  dots: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeDot: {
    backgroundColor: "#fff",
  },
  homeContent: {
    alignItems: "center",
    maxWidth: 700,
    marginBottom: 40,
  },
  variantB: {
    backgroundColor: "#f0f4ff",
    borderWidth: 2,
    borderColor: "#a1b8ff",
    padding: 30,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f8f1f1",
    textAlign: "center",
    marginBottom: 20,
  },
  variantBTitle: {
    color: "#2a2f74",
    fontSize: 26,
  },
  description: {
    fontSize: 16,
    color: "#bcbff8",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  variantBDescription: {
    color: "#465b9f",
    fontSize: 15,
  },
  exploreButton: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  benefitsSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: "#f4f5f7",
    padding: 20,
    borderRadius: 8,
    marginTop: 30,
    width: "100%",
    maxWidth: 1300,
  },
  benefit: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    width: width > 768 ? 180 : (width - 80) / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  benefitDescription: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});

export default HomeSection;

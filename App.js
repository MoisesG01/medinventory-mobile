import React from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Import contexts
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";

// Import screens
import DashboardScreen from "./src/screens/DashboardScreen";
import SearchAssetScreen from "./src/screens/SearchAssetScreen";
import ReportsScreen from "./src/screens/ReportsScreen";
import ChartsScreen from "./src/screens/ChartsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AssetDetailScreen from "./src/screens/AssetDetailScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import TermsScreen from "./src/screens/TermsScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import EquipmentsListScreen from "./src/screens/EquipmentsListScreen";
import EquipmentDetailScreen from "./src/screens/EquipmentDetailScreen";
import EquipmentFormScreen from "./src/screens/EquipmentFormScreen";

// Import theme
import theme from "./src/styles/theme";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Reports") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (route.name === "Charts") {
            iconName = focused ? "analytics" : "analytics-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.gray200,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: "Início" }}
      />
      <Tab.Screen
        name="Search"
        component={SearchAssetScreen}
        options={{ tabBarLabel: "Buscar" }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ tabBarLabel: "Relatórios" }}
      />
      <Tab.Screen
        name="Charts"
        component={ChartsScreen}
        options={{ tabBarLabel: "Gráficos" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Perfil" }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.white,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={{
            marginTop: theme.spacing.md,
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSize.md,
          }}
        >
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor={theme.colors.white} />
      {isAuthenticated ? (
        <Stack.Navigator
          initialRouteName="MainTabs"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="AssetDetail" component={AssetDetailScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Terms" component={TermsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Equipments" component={EquipmentsListScreen} />
          <Stack.Screen name="EquipmentDetail" component={EquipmentDetailScreen} />
          <Stack.Screen name="EquipmentForm" component={EquipmentFormScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Terms" component={TermsScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import theme from "../styles/theme";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigation = useNavigation();
  const { user, logout, deleteAccount } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sair da Conta", "Tem certeza que deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleChangePassword = () => {
    Alert.alert("Alterar Senha", "Funcionalidade em desenvolvimento");
  };

  const handleSupport = () => {
    Alert.alert("Suporte", "Funcionalidade em desenvolvimento");
  };

  const handleAbout = () => {
    Alert.alert(
      "Sobre o App",
      "MedInventory v1.0.0\nSistema de Gestão de Ativos Médicos"
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir Conta",
      "Essa ação é permanente. Deseja realmente excluir sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              const result = await deleteAccount();
              if (!result.success) {
                Alert.alert(
                  "Erro",
                  result.error || "Não foi possível excluir a conta"
                );
              } else {
                Alert.alert(
                  "Conta excluída",
                  "Sua conta foi removida com sucesso."
                );
              }
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a conta");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 1,
      title: "Editar Perfil",
      icon: "person-outline",
      onPress: handleEditProfile,
    },
    {
      id: 2,
      title: "Alterar Senha",
      icon: "lock-closed-outline",
      onPress: handleChangePassword,
    },
    {
      id: 3,
      title: "Notificações",
      icon: "notifications-outline",
      hasSwitch: true,
      switchValue: notificationsEnabled,
      onSwitchChange: setNotificationsEnabled,
    },
    {
      id: 4,
      title: "Modo Escuro",
      icon: "moon-outline",
      hasSwitch: true,
      switchValue: darkModeEnabled,
      onSwitchChange: setDarkModeEnabled,
    },
    {
      id: 5,
      title: "Autenticação Biométrica",
      icon: "finger-print-outline",
      hasSwitch: true,
      switchValue: biometricEnabled,
      onSwitchChange: setBiometricEnabled,
    },
    {
      id: 6,
      title: "Suporte",
      icon: "help-circle-outline",
      onPress: handleSupport,
    },
    {
      id: 7,
      title: "Sobre",
      icon: "information-circle-outline",
      onPress: handleAbout,
    },
  ];

  const MenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <Ionicons name={item.icon} size={20} color={theme.colors.primary} />
        </View>
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      {item.hasSwitch ? (
        <Switch
          value={item.switchValue}
          onValueChange={item.onSwitchChange}
          trackColor={{
            false: theme.colors.gray300,
            true: theme.colors.primaryLight,
          }}
          thumbColor={
            item.switchValue ? theme.colors.primary : theme.colors.gray400
          }
        />
      ) : (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.textSecondary}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons
              name="settings-outline"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={theme.colors.gradients.primary}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileContent}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Ionicons
                    name="person"
                    size={40}
                    color={theme.colors.white}
                  />
                </View>
                <TouchableOpacity style={styles.editAvatarButton}>
                  <Ionicons
                    name="camera"
                    size={16}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              </View>
            <Text style={styles.userName}>
              {user?.nome || user?.name || "Usuário"}
            </Text>
              <Text style={styles.userEmail}>
                {user?.email || "joao.silva@hospital.com"}
              </Text>
            <Text style={styles.userRole}>
              {user?.tipo || "Administrador do Sistema"}
            </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Ativos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>Relatórios</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Alertas</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuSectionTitle}>Configurações</Text>
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color={theme.colors.error}
            />
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
            onPress={handleDeleteAccount}
            disabled={deleting}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={theme.colors.white}
            />
            <Text style={styles.deleteButtonText}>
              {deleting ? "Excluindo..." : "Excluir Conta"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>MedInventory v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  settingsButton: {
    padding: theme.spacing.sm,
  },
  profileCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    ...theme.shadows.lg,
  },
  profileGradient: {
    padding: theme.spacing.xl,
  },
  profileContent: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.colors.white,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.sm,
  },
  userName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.fontSize.md,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: theme.spacing.xs,
  },
  userRole: {
    fontSize: theme.typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.7)",
  },
  statsContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  menuContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  menuSectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  menuItemText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  logoutContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.error + "30",
    ...theme.shadows.sm,
  },
  logoutButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.sm,
  },
  deleteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  deleteButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: theme.spacing.sm,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
  },
  versionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});

export default ProfileScreen;

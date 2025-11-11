import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import theme from "../styles/theme";

const { width } = Dimensions.get("window");

const DashboardScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const onRefresh = () => {
    setRefreshing(true);
    // Simular carregamento
    setTimeout(() => setRefreshing(false), 2000);
  };

  const statsData = [
    {
      title: "Total de Ativos",
      value: "1,247",
      change: "+12%",
      changeType: "positive",
      icon: "medical-outline",
      color: theme.colors.primary,
    },
    {
      title: "Em Manutenção",
      value: "23",
      change: "-5%",
      changeType: "negative",
      icon: "construct-outline",
      color: theme.colors.warning,
    },
    {
      title: "Disponíveis",
      value: "1,198",
      change: "+8%",
      changeType: "positive",
      icon: "checkmark-circle-outline",
      color: theme.colors.success,
    },
    {
      title: "Vencendo",
      value: "15",
      change: "+3",
      changeType: "warning",
      icon: "time-outline",
      color: theme.colors.error,
    },
  ];

  const quickActions = [
    {
      title: "Buscar Ativo",
      subtitle: "Localize equipamentos rapidamente",
      icon: "search-outline",
      color: theme.colors.white,
      gradient: theme.colors.gradients.ocean,
      onPress: () => navigation.navigate("Search"),
    },
    {
      title: "Relatórios",
      subtitle: "Acompanhe indicadores atualizados",
      icon: "bar-chart-outline",
      color: theme.colors.white,
      gradient: theme.colors.gradients.secondary,
      onPress: () => navigation.navigate("Reports"),
    },
    {
      title: "Notificações",
      subtitle: "Veja alertas e avisos recentes",
      icon: "notifications-outline",
      color: theme.colors.white,
      gradient: theme.colors.gradients.warning,
      onPress: () => navigation.navigate("Notifications"),
    },
    {
      title: "Equipamentos",
      subtitle: "Gerencie o inventário completo",
      icon: "medkit-outline",
      color: theme.colors.white,
      gradient: theme.colors.gradients.primary,
      onPress: () => navigation.navigate("Equipments"),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Equipamento adicionado",
      description: "Monitor de pressão arterial - Sala 201",
      time: "2 horas atrás",
      type: "add",
    },
    {
      id: 2,
      title: "Manutenção agendada",
      description: "Raio-X móvel - Manutenção preventiva",
      time: "4 horas atrás",
      type: "maintenance",
    },
    {
      id: 3,
      title: "Ativo movido",
      description: "Desfibrilador - Sala 105 → Sala 203",
      time: "6 horas atrás",
      type: "move",
    },
  ];

  const criticalAlerts = [
    {
      id: 1,
      title: "Certificação Vencida",
      description: "Desfibrilador - Sala 105",
      priority: "high",
      time: "1 dia atrás",
    },
    {
      id: 2,
      title: "Manutenção Atrasada",
      description: "Raio-X - Sala 203",
      priority: "medium",
      time: "2 dias atrás",
    },
    {
      id: 3,
      title: "Equipamento Offline",
      description: "Monitor Cardíaco - Sala 301",
      priority: "high",
      time: "3 horas atrás",
    },
  ];

  const criticalEquipment = [
    {
      id: 1,
      name: "Desfibrilador",
      location: "Sala 105",
      status: "critical",
      lastCheck: "2 horas atrás",
    },
    {
      id: 2,
      name: "Ventilador",
      location: "UTI 1",
      status: "warning",
      lastCheck: "1 hora atrás",
    },
    {
      id: 3,
      name: "Monitor Cardíaco",
      location: "Sala 301",
      status: "offline",
      lastCheck: "3 horas atrás",
    },
  ];

  const performanceMetrics = [
    {
      title: "Uptime Médio",
      value: "98.5%",
      change: "+2.1%",
      changeType: "positive",
      icon: "trending-up-outline",
      color: theme.colors.success,
    },
    {
      title: "Tempo de Resposta",
      value: "2.3 min",
      change: "-15%",
      changeType: "positive",
      icon: "time-outline",
      color: theme.colors.info,
    },
    {
      title: "Custo por Ativo",
      value: "R$ 1,250",
      change: "-8%",
      changeType: "positive",
      icon: "cash-outline",
      color: theme.colors.warning,
    },
  ];

  const StatCard = ({ item }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: item.color + "15" }]}>
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <View
          style={[
            styles.changeBadge,
            {
              backgroundColor:
                item.changeType === "positive"
                  ? theme.colors.success + "15"
                  : item.changeType === "negative"
                  ? theme.colors.error + "15"
                  : theme.colors.warning + "15",
            },
          ]}
        >
          <Ionicons
            name={
              item.changeType === "positive"
                ? "trending-up"
                : item.changeType === "negative"
                ? "trending-down"
                : "remove"
            }
            size={12}
            color={
              item.changeType === "positive"
                ? theme.colors.success
                : item.changeType === "negative"
                ? theme.colors.error
                : theme.colors.warning
            }
          />
          <Text
            style={[
              styles.changeText,
              {
                color:
                  item.changeType === "positive"
                    ? theme.colors.success
                    : item.changeType === "negative"
                    ? theme.colors.error
                    : theme.colors.warning,
              },
            ]}
          >
            {item.change}
          </Text>
        </View>
      </View>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statTitle}>{item.title}</Text>
    </View>
  );

  const QuickActionCard = ({ item }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={item.onPress}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={item.gradient ?? theme.colors.gradients.primary}
        style={styles.actionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.actionIconWrapper}>
          <View style={styles.actionIcon}>
            <Ionicons name={item.icon} size={22} color={item.color} />
          </View>
        </View>
        <View style={styles.actionText}>
          <Text
            style={styles.actionTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <Text
            style={styles.actionSubtitle}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.subtitle}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const ActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View
        style={[
          styles.activityIcon,
          {
            backgroundColor:
              item.type === "add"
                ? theme.colors.success + "20"
                : item.type === "maintenance"
                ? theme.colors.warning + "20"
                : theme.colors.info + "20",
          },
        ]}
      >
        <Ionicons
          name={
            item.type === "add"
              ? "add-circle"
              : item.type === "maintenance"
              ? "construct"
              : "move"
          }
          size={20}
          color={
            item.type === "add"
              ? theme.colors.success
              : item.type === "maintenance"
              ? theme.colors.warning
              : theme.colors.info
          }
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  );

  const AlertItem = ({ item }) => (
    <View style={styles.alertItem}>
      <View
        style={[
          styles.alertIcon,
          {
            backgroundColor:
              item.priority === "high"
                ? theme.colors.error + "20"
                : theme.colors.warning + "20",
          },
        ]}
      >
        <Ionicons
          name={item.priority === "high" ? "warning" : "information-circle"}
          size={20}
          color={
            item.priority === "high" ? theme.colors.error : theme.colors.warning
          }
        />
      </View>
      <View style={styles.alertContent}>
        <Text style={styles.alertTitle}>{item.title}</Text>
        <Text style={styles.alertDescription}>{item.description}</Text>
        <Text style={styles.alertTime}>{item.time}</Text>
      </View>
      <View
        style={[
          styles.priorityBadge,
          {
            backgroundColor:
              item.priority === "high"
                ? theme.colors.error + "15"
                : theme.colors.warning + "15",
          },
        ]}
      >
        <Text
          style={[
            styles.priorityText,
            {
              color:
                item.priority === "high"
                  ? theme.colors.error
                  : theme.colors.warning,
            },
          ]}
        >
          {item.priority === "high" ? "Alto" : "Médio"}
        </Text>
      </View>
    </View>
  );

  const EquipmentItem = ({ item }) => (
    <View style={styles.equipmentItem}>
      <View style={styles.equipmentInfo}>
        <Text style={styles.equipmentName}>{item.name}</Text>
        <Text style={styles.equipmentLocation}>{item.location}</Text>
        <Text style={styles.equipmentLastCheck}>{item.lastCheck}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              item.status === "critical"
                ? theme.colors.error + "15"
                : item.status === "warning"
                ? theme.colors.warning + "15"
                : theme.colors.gray300 + "15",
          },
        ]}
      >
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor:
                item.status === "critical"
                  ? theme.colors.error
                  : item.status === "warning"
                  ? theme.colors.warning
                  : theme.colors.gray500,
            },
          ]}
        />
        <Text
          style={[
            styles.statusText,
            {
              color:
                item.status === "critical"
                  ? theme.colors.error
                  : item.status === "warning"
                  ? theme.colors.warning
                  : theme.colors.gray500,
            },
          ]}
        >
          {item.status === "critical"
            ? "Crítico"
            : item.status === "warning"
            ? "Atenção"
            : "Offline"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={theme.colors.gradients.primary}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Ionicons name="person" size={24} color={theme.colors.white} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.greeting}>Bem-vindo de volta!</Text>
                <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
                <Text style={styles.userRole}>
                  {user?.role || "Usuário"} - {user?.hospital || "Sistema"}
                </Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => navigation.navigate("Notifications")}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={theme.colors.white}
                />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate("Profile")}
              >
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Visão Geral</Text>
          <View style={styles.statsGrid}>
            {statsData.map((item, index) => (
              <StatCard key={index} item={item} />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((item, index) => (
              <QuickActionCard key={index} item={item} />
            ))}
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Métricas de Performance</Text>
          <View style={styles.metricsGrid}>
            {performanceMetrics.map((item, index) => (
              <StatCard key={index} item={item} />
            ))}
          </View>
        </View>

        {/* Critical Alerts */}
        <View style={styles.alertsContainer}>
          <View style={styles.alertsHeader}>
            <Text style={styles.sectionTitle}>Alertas Críticos</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver todos</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.alertsList}>
            {criticalAlerts.map((item) => (
              <AlertItem key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Critical Equipment */}
        <View style={styles.equipmentContainer}>
          <View style={styles.equipmentHeader}>
            <Text style={styles.sectionTitle}>Equipamentos Críticos</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver todos</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.equipmentList}>
            {criticalEquipment.map((item) => (
              <EquipmentItem key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.activitiesContainer}>
          <View style={styles.activitiesHeader}>
            <Text style={styles.sectionTitle}>Atividades Recentes</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver todas</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.activitiesList}>
            {recentActivities.map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </View>
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
    paddingBottom: theme.spacing.xl,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  userDetails: {
    flex: 1,
  },
  userRole: {
    fontSize: theme.typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  greeting: {
    fontSize: theme.typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: theme.typography.fontWeight.regular,
  },
  userName: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    position: "relative",
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: theme.borderRadius.full,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: theme.typography.fontWeight.bold,
  },
  profileButton: {
    padding: theme.spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: theme.borderRadius.full,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  changeBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  changeText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xxl,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  statTitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  actionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    borderRadius: theme.borderRadius.xxl,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
    ...theme.shadows.lg,
  },
  actionGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  actionIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 18,
  },
  activitiesContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  activitiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
    marginRight: theme.spacing.xs,
  },
  activitiesList: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  activityItem: {
    flexDirection: "row",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  },
  activityDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  activityTime: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textDisabled,
  },
  // Performance Metrics
  metricsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  // Critical Alerts
  alertsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  alertsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  alertsList: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  alertItem: {
    flexDirection: "row",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
    alignItems: "center",
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  },
  alertDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  alertTime: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textDisabled,
  },
  priorityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  priorityText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  // Critical Equipment
  equipmentContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  equipmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  equipmentList: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  equipmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  },
  equipmentLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  equipmentLastCheck: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textDisabled,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default DashboardScreen;

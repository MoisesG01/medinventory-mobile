import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import theme from "../styles/theme";

const { width } = Dimensions.get("window");

const NotificationsScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const navigation = useNavigation();

  const filterOptions = [
    { id: "all", label: "Todas", icon: "notifications-outline" },
    { id: "maintenance", label: "Manutenção", icon: "construct-outline" },
    { id: "expiry", label: "Vencimento", icon: "time-outline" },
    { id: "alerts", label: "Alertas", icon: "warning-outline" },
  ];

  const mockNotifications = [
    {
      id: 1,
      type: "maintenance",
      title: "Manutenção Preventiva Agendada",
      message:
        "O equipamento Monitor de Sinais Vitais (AST-001) está agendado para manutenção preventiva em 3 dias.",
      time: "2 horas atrás",
      isRead: false,
      priority: "high",
      assetId: "AST-001",
      assetName: "Monitor de Sinais Vitais",
    },
    {
      id: 2,
      type: "expiry",
      title: "Garantia Expirando",
      message:
        "A garantia do equipamento Raio-X Móvel (AST-002) expira em 15 dias.",
      time: "4 horas atrás",
      isRead: false,
      priority: "medium",
      assetId: "AST-002",
      assetName: "Raio-X Móvel",
    },
    {
      id: 3,
      type: "alerts",
      title: "Equipamento em Manutenção",
      message:
        "O Desfibrilador (AST-003) foi enviado para manutenção corretiva.",
      time: "1 dia atrás",
      isRead: true,
      priority: "high",
      assetId: "AST-003",
      assetName: "Desfibrilador",
    },
    {
      id: 4,
      type: "maintenance",
      title: "Manutenção Concluída",
      message:
        "A manutenção do Ventilador Mecânico (AST-004) foi concluída com sucesso.",
      time: "2 dias atrás",
      isRead: true,
      priority: "low",
      assetId: "AST-004",
      assetName: "Ventilador Mecânico",
    },
    {
      id: 5,
      type: "expiry",
      title: "Certificação Vencida",
      message:
        "A certificação do equipamento Ultrassom (AST-005) venceu há 5 dias.",
      time: "3 dias atrás",
      isRead: true,
      priority: "high",
      assetId: "AST-005",
      assetName: "Ultrassom",
    },
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case "maintenance":
        return theme.colors.warning;
      case "expiry":
        return theme.colors.error;
      case "alerts":
        return theme.colors.info;
      default:
        return theme.colors.primary;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "maintenance":
        return "construct";
      case "expiry":
        return "time";
      case "alerts":
        return "warning";
      default:
        return "notifications";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return theme.colors.error;
      case "medium":
        return theme.colors.warning;
      case "low":
        return theme.colors.success;
      default:
        return theme.colors.gray500;
    }
  };

  const filteredNotifications = mockNotifications.filter((notification) => {
    return selectedFilter === "all" || notification.type === selectedFilter;
  });

  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (notificationId) => {
    Alert.alert("Marcar como Lida", "Notificação marcada como lida");
  };

  const handleViewAsset = (assetId) => {
    const asset = mockNotifications.find((n) => n.assetId === assetId);
    if (asset) {
      navigation.navigate("AssetDetail", {
        asset: {
          id: asset.assetId,
          name: asset.assetName,
          model: "Modelo Exemplo",
          serialNumber: "SN-001",
          location: "Localização Exemplo",
          status: "available",
        },
      });
    }
  };

  const handleMarkAllAsRead = () => {
    Alert.alert(
      "Marcar Todas como Lidas",
      "Todas as notificações foram marcadas como lidas"
    );
  };

  const FilterButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === item.id && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(item.id)}
    >
      <Ionicons
        name={item.icon}
        size={20}
        color={
          selectedFilter === item.id ? theme.colors.white : theme.colors.primary
        }
      />
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === item.id && styles.filterButtonTextActive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const NotificationCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
      onPress={() => handleViewAsset(item.assetId)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationLeft}>
          <View
            style={[
              styles.typeIcon,
              { backgroundColor: getTypeColor(item.type) + "20" },
            ]}
          >
            <Ionicons
              name={getTypeIcon(item.type)}
              size={20}
              color={getTypeColor(item.type)}
            />
          </View>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
        </View>
        <View style={styles.notificationRight}>
          {!item.isRead && <View style={styles.unreadDot} />}
          <View
            style={[
              styles.priorityDot,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          />
        </View>
      </View>

      <Text style={styles.notificationMessage}>{item.message}</Text>

      <View style={styles.notificationActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleViewAsset(item.assetId)}
        >
          <Ionicons name="eye-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.actionButtonText}>Ver Ativo</Text>
        </TouchableOpacity>
        {!item.isRead && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleMarkAsRead(item.id)}
          >
            <Ionicons
              name="checkmark-outline"
              size={16}
              color={theme.colors.success}
            />
            <Text
              style={[styles.actionButtonText, { color: theme.colors.success }]}
            >
              Marcar como Lida
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Notificações</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Ionicons
              name="checkmark-done-outline"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <LinearGradient
            colors={theme.colors.gradients.primary}
            style={styles.statsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{unreadCount}</Text>
                <Text style={styles.statLabel}>Não Lidas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {mockNotifications.length}
                </Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {
                    mockNotifications.filter((n) => n.priority === "high")
                      .length
                  }
                </Text>
                <Text style={styles.statLabel}>Urgentes</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterOptions.map((item) => (
              <FilterButton key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* Notifications List */}
        <View style={styles.notificationsContainer}>
          <View style={styles.notificationsHeader}>
            <Text style={styles.notificationsTitle}>
              {filteredNotifications.length} notificação
              {filteredNotifications.length !== 1 ? "ões" : ""}
            </Text>
          </View>

          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} item={notification} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="notifications-off-outline"
                size={64}
                color={theme.colors.gray400}
              />
              <Text style={styles.emptyStateTitle}>Nenhuma notificação</Text>
              <Text style={styles.emptyStateText}>
                Não há notificações para o filtro selecionado
              </Text>
            </View>
          )}
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
    backgroundColor: theme.colors.white,
    ...theme.shadows.sm,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  unreadBadge: {
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: theme.spacing.sm,
  },
  unreadBadgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: theme.typography.fontWeight.bold,
  },
  statsCard: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    ...theme.shadows.lg,
  },
  statsGradient: {
    padding: theme.spacing.lg,
  },
  statsContent: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.8)",
  },
  filtersContainer: {
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginLeft: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  filterButtonText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  filterButtonTextActive: {
    color: theme.colors.white,
  },
  notificationsContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  notificationsHeader: {
    paddingVertical: theme.spacing.md,
  },
  notificationsTitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  notificationCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  notificationLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  notificationTime: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  notificationRight: {
    alignItems: "center",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  notificationMessage: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    lineHeight:
      theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
    marginBottom: theme.spacing.md,
  },
  notificationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
    flex: 0.48,
    justifyContent: "center",
  },
  actionButtonText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: theme.spacing.xxxl,
  },
  emptyStateTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});

export default NotificationsScreen;

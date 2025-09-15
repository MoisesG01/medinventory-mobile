import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import theme from "../styles/theme";

const { width } = Dimensions.get("window");

const AssetDetailScreen = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { asset } = route.params || {};

  // Mock data for asset details
  const assetData = asset || {
    id: "AST-001",
    name: "Monitor de Sinais Vitais",
    model: "Philips IntelliVue MP70",
    serialNumber: "PH123456789",
    location: "UTI - Leito 5",
    status: "available",
    category: "Monitoramento",
    manufacturer: "Philips",
    purchaseDate: "2023-01-15",
    warrantyExpiry: "2025-01-15",
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-04-10",
    value: "R$ 45.000,00",
    description: "Monitor de sinais vitais multiparâmetro para uso em UTI",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return theme.colors.success;
      case "maintenance":
        return theme.colors.warning;
      case "expired":
        return theme.colors.error;
      case "in_use":
        return theme.colors.info;
      default:
        return theme.colors.gray500;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Disponível";
      case "maintenance":
        return "Manutenção";
      case "expired":
        return "Vencido";
      case "in_use":
        return "Em Uso";
      default:
        return "Desconhecido";
    }
  };

  const handleEditAsset = () => {
    setShowEditModal(true);
  };

  const handleMaintenance = () => {
    setShowMaintenanceModal(true);
  };

  const handleViewHistory = () => {
    setShowHistoryModal(true);
  };

  const handleGenerateQR = () => {
    Alert.alert("QR Code", "QR Code gerado com sucesso!");
  };

  const handlePrintLabel = () => {
    Alert.alert("Etiqueta", "Etiqueta enviada para impressão!");
  };

  const maintenanceHistory = [
    {
      id: 1,
      date: "2024-01-10",
      type: "Manutenção Preventiva",
      technician: "João Silva",
      description: "Calibração e limpeza geral",
      status: "Concluída",
    },
    {
      id: 2,
      date: "2023-10-15",
      type: "Reparo",
      technician: "Maria Santos",
      description: "Substituição de sensor de pressão",
      status: "Concluída",
    },
    {
      id: 3,
      date: "2023-07-20",
      type: "Manutenção Preventiva",
      technician: "Carlos Oliveira",
      description: "Verificação de funcionamento",
      status: "Concluída",
    },
  ];

  const DetailCard = ({ title, children, style }) => (
    <View style={[styles.detailCard, style]}>
      <Text style={styles.detailCardTitle}>{title}</Text>
      {children}
    </View>
  );

  const ActionButton = ({
    icon,
    title,
    onPress,
    color = theme.colors.primary,
  }) => (
    <TouchableOpacity
      style={[styles.actionButton, { borderColor: color }]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.actionButtonText, { color }]}>{title}</Text>
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
          <Text style={styles.headerTitle}>Detalhes do Ativo</Text>
          <TouchableOpacity onPress={handleEditAsset}>
            <Ionicons
              name="create-outline"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Asset Header Card */}
        <View style={styles.assetHeaderCard}>
          <LinearGradient
            colors={theme.colors.gradients.primary}
            style={styles.assetHeaderGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.assetHeaderContent}>
              <View style={styles.assetIcon}>
                <Ionicons name="medical" size={32} color={theme.colors.white} />
              </View>
              <View style={styles.assetHeaderInfo}>
                <Text style={styles.assetName}>{assetData.name}</Text>
                <Text style={styles.assetModel}>{assetData.model}</Text>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(assetData.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusText(assetData.status)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            <ActionButton
              icon="build-outline"
              title="Manutenção"
              onPress={handleMaintenance}
              color={theme.colors.warning}
            />
            <ActionButton
              icon="qr-code-outline"
              title="QR Code"
              onPress={handleGenerateQR}
              color={theme.colors.info}
            />
            <ActionButton
              icon="print-outline"
              title="Etiqueta"
              onPress={handlePrintLabel}
              color={theme.colors.secondary}
            />
            <ActionButton
              icon="time-outline"
              title="Histórico"
              onPress={handleViewHistory}
              color={theme.colors.primary}
            />
          </View>
        </View>

        {/* Asset Information */}
        <View style={styles.infoContainer}>
          <DetailCard title="Informações Básicas">
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID do Ativo:</Text>
              <Text style={styles.infoValue}>{assetData.id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Número de Série:</Text>
              <Text style={styles.infoValue}>{assetData.serialNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Localização:</Text>
              <Text style={styles.infoValue}>{assetData.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Categoria:</Text>
              <Text style={styles.infoValue}>{assetData.category}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fabricante:</Text>
              <Text style={styles.infoValue}>{assetData.manufacturer}</Text>
            </View>
          </DetailCard>

          <DetailCard title="Informações Financeiras">
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Valor:</Text>
              <Text style={styles.infoValue}>{assetData.value}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Data de Compra:</Text>
              <Text style={styles.infoValue}>{assetData.purchaseDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Garantia até:</Text>
              <Text style={styles.infoValue}>{assetData.warrantyExpiry}</Text>
            </View>
          </DetailCard>

          <DetailCard title="Manutenção">
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Última Manutenção:</Text>
              <Text style={styles.infoValue}>{assetData.lastMaintenance}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Próxima Manutenção:</Text>
              <Text style={[styles.infoValue, { color: theme.colors.warning }]}>
                {assetData.nextMaintenance}
              </Text>
            </View>
          </DetailCard>

          <DetailCard title="Descrição">
            <Text style={styles.descriptionText}>{assetData.description}</Text>
          </DetailCard>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.modalCancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Ativo</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.modalSaveButton}>Salvar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Funcionalidade em desenvolvimento
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Maintenance Modal */}
      <Modal
        visible={showMaintenanceModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowMaintenanceModal(false)}>
              <Text style={styles.modalCancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Agendar Manutenção</Text>
            <TouchableOpacity onPress={() => setShowMaintenanceModal(false)}>
              <Text style={styles.modalSaveButton}>Agendar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Funcionalidade em desenvolvimento
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* History Modal */}
      <Modal
        visible={showHistoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
              <Text style={styles.modalCancelButton}>Fechar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Histórico de Manutenção</Text>
            <View style={{ width: 60 }} />
          </View>
          <ScrollView style={styles.modalContent}>
            {maintenanceHistory.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyType}>{item.type}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
                <Text style={styles.historyTechnician}>
                  Técnico: {item.technician}
                </Text>
                <Text style={styles.historyDescription}>
                  {item.description}
                </Text>
                <View style={styles.historyStatus}>
                  <Text
                    style={[
                      styles.historyStatusText,
                      { color: theme.colors.success },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  assetHeaderCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    ...theme.shadows.lg,
  },
  assetHeaderGradient: {
    padding: theme.spacing.xl,
  },
  assetHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  assetIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  assetHeaderInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  assetModel: {
    fontSize: theme.typography.fontSize.md,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: theme.spacing.sm,
  },
  statusContainer: {
    alignSelf: "flex-start",
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.white,
  },
  actionsContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    ...theme.shadows.sm,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.xs,
  },
  infoContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  detailCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  detailCardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    flex: 1,
    textAlign: "right",
  },
  descriptionText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    lineHeight:
      theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  modalCancelButton: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  modalSaveButton: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  modalSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.xl,
  },
  historyItem: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  historyType: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  historyDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  historyTechnician: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  historyDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  historyStatus: {
    alignSelf: "flex-start",
  },
  historyStatusText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default AssetDetailScreen;

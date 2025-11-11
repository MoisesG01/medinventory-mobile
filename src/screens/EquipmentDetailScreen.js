import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { equipmentApi } from "../services/api";
import theme from "../styles/theme";

const STATUS_OPTIONS = [
  "DISPONIVEL",
  "EM_USO",
  "EM_MANUTENCAO",
  "INATIVO",
  "SUCATEADO",
];

const LABELS = {
  nome: "Nome",
  tipo: "Tipo",
  fabricante: "Fabricante",
  modelo: "Modelo",
  numeroSerie: "Número de Série",
  codigoPatrimonial: "Código Patrimonial",
  setorAtual: "Setor Atual",
  statusOperacional: "Status Operacional",
  dataAquisicao: "Data de Aquisição",
  valorAquisicao: "Valor de Aquisição",
  dataFimGarantia: "Fim da Garantia",
  vidaUtilEstimativa: "Vida Útil Estimada (anos)",
  registroAnvisa: "Registro ANVISA",
  classeRisco: "Classe de Risco",
  dataUltimaManutencao: "Data da Última Manutenção",
  dataProximaManutencao: "Data da Próxima Manutenção",
  responsavelTecnico: "Responsável Técnico",
  criticidade: "Criticidade",
  observacoes: "Observações",
  userId: "Responsável",
  createdAt: "Criado em",
  updatedAt: "Atualizado em",
};

const formatDate = (value) => {
  if (!value) return "Não informado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
};

const EquipmentDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const equipmentId = route.params?.equipmentId;
  const initialEquipment = route.params?.equipment ?? null;

  const [equipment, setEquipment] = useState(initialEquipment);
  const [loading, setLoading] = useState(!initialEquipment);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadEquipment = useCallback(async () => {
    if (!equipmentId) return;
    setLoading(true);
    try {
      const data = await equipmentApi.getById(equipmentId);
      setEquipment(data);
    } catch (error) {
      console.error("Erro ao carregar equipamento:", error);
      Alert.alert(
        "Erro",
        error?.message ||
          error?.data?.message ||
          "Não foi possível carregar os detalhes do equipamento."
      );
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [equipmentId, navigation]);

  useFocusEffect(
    useCallback(() => {
      if (!initialEquipment || route.params?.refreshTimestamp) {
        loadEquipment();
      }
    }, [initialEquipment, loadEquipment, route.params?.refreshTimestamp])
  );

  const handleEdit = () => {
    if (!equipment) return;

    navigation.navigate("EquipmentForm", {
      mode: "edit",
      equipmentId: equipment.id,
      equipment,
    });
  };

  const handleDelete = () => {
    if (!equipment) return;

    Alert.alert(
      "Excluir Equipamento",
      "Tem certeza que deseja excluir este equipamento? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await equipmentApi.remove(equipment.id);
              Alert.alert("Sucesso", "Equipamento excluído com sucesso.");
              navigation.navigate("MainTabs", {
                screen: "EquipmentsTab",
                params: {
                  refresh: Date.now(),
                },
              });
              navigation.goBack();
            } catch (error) {
              console.error("Erro ao excluir equipamento:", error);
              Alert.alert(
                "Erro",
                error?.message ||
                  error?.data?.message ||
                  "Não foi possível excluir o equipamento."
              );
            }
          },
        },
      ]
    );
  };

  const handleSelectStatus = async (status) => {
    if (!equipment) return;
    setUpdatingStatus(true);
    try {
      const updated = await equipmentApi.updateStatus(equipment.id, {
        statusOperacional: status,
      });
      const formattedUpdated = updated?.user ? updated.user : updated;
      setEquipment(formattedUpdated);
      navigation.setParams({
        equipmentId: equipment.id,
        equipment: formattedUpdated,
        refreshTimestamp: Date.now(),
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert(
        "Erro",
        error?.message ||
          error?.data?.message ||
          "Não foi possível atualizar o status do equipamento."
      );
    } finally {
      setUpdatingStatus(false);
      setStatusModalVisible(false);
    }
  };

  if (loading || !equipment) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando equipamento...</Text>
      </SafeAreaView>
    );
  }

  const details = [
    "nome",
    "tipo",
    "fabricante",
    "modelo",
    "numeroSerie",
    "codigoPatrimonial",
    "setorAtual",
    "statusOperacional",
    "dataAquisicao",
    "valorAquisicao",
    "dataFimGarantia",
    "vidaUtilEstimativa",
    "registroAnvisa",
    "classeRisco",
    "dataUltimaManutencao",
    "dataProximaManutencao",
    "responsavelTecnico",
    "criticidade",
    "observacoes",
    "userId",
    "createdAt",
    "updatedAt",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{equipment.nome}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações gerais</Text>
          {details.map((field) => {
            const value = equipment[field];
            let displayValue = value;

            if (
              [
                "dataAquisicao",
                "dataFimGarantia",
                "dataUltimaManutencao",
                "dataProximaManutencao",
                "createdAt",
                "updatedAt",
              ].includes(field)
            ) {
              displayValue = formatDate(value);
            } else if (field === "valorAquisicao" && value !== undefined && value !== null) {
              displayValue = `R$ ${Number(value).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`;
            } else if (field === "vidaUtilEstimativa" && value !== undefined && value !== null) {
              displayValue = `${value} ano${Number(value) === 1 ? "" : "s"}`;
            } else if (field === "statusOperacional" && value) {
              displayValue = value.replace(/_/g, " ");
            } else if (!value) {
              displayValue = "Não informado";
            }

            return (
              <View key={field} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{LABELS[field] ?? field}</Text>
                <Text style={styles.detailValue}>{displayValue}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.bottomButton, styles.statusButton]}
          onPress={() => setStatusModalVisible(true)}
        >
          <Ionicons name="sync-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.statusButtonText}>Atualizar status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomButton, styles.editButton]}
          onPress={handleEdit}
        >
          <Ionicons name="create-outline" size={20} color={theme.colors.white} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.white} />
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={statusModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar status operacional</Text>
            {STATUS_OPTIONS.map((status) => {
              const selected = equipment.statusOperacional === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    selected && styles.statusOptionSelected,
                  ]}
                  onPress={() => handleSelectStatus(status)}
                  disabled={updatingStatus}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      selected && styles.statusOptionTextSelected,
                    ]}
                  >
                    {status.replace(/_/g, " ")}
                  </Text>
                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setStatusModalVisible(false)}
              disabled={updatingStatus}
            >
              <Text style={styles.closeModalText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.gray100,
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: theme.spacing.lg,
    marginHorizontal: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxl,
    ...theme.shadows.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    marginBottom: theme.spacing.md,
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
  },
  bottomButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.xs,
  },
  statusButton: {
    backgroundColor: theme.colors.gray100,
  },
  statusButtonText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  editButton: {
    backgroundColor: theme.colors.info,
  },
  editButtonText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
  deleteButtonText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: "100%",
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    marginBottom: theme.spacing.sm,
  },
  statusOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "15",
  },
  statusOptionText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSize.md,
    textTransform: "capitalize",
  },
  statusOptionTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  closeModalButton: {
    marginTop: theme.spacing.sm,
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  closeModalText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default EquipmentDetailScreen;


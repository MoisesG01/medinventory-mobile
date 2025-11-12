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
import { LinearGradient } from "expo-linear-gradient";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

const STATUS_INFO = {
  DISPONIVEL: {
    label: "Disponível",
    icon: "checkmark-circle",
    color: theme.colors.success,
    background: theme.colors.success + "20",
  },
  EM_USO: {
    label: "Em uso",
    icon: "pulse-outline",
    color: theme.colors.info,
    background: theme.colors.info + "20",
  },
  EM_MANUTENCAO: {
    label: "Manutenção",
    icon: "construct-outline",
    color: theme.colors.warning,
    background: theme.colors.warning + "20",
  },
  INATIVO: {
    label: "Inativo",
    icon: "pause-circle-outline",
    color: theme.colors.gray500,
    background: theme.colors.gray500 + "20",
  },
  SUCATEADO: {
    label: "Sucateado",
    icon: "trash-outline",
    color: theme.colors.error,
    background: theme.colors.error + "20",
  },
  DEFAULT: {
    label: "Status desconhecido",
    icon: "help-circle-outline",
    color: theme.colors.textSecondary,
    background: theme.colors.gray200,
  },
};

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

const DETAIL_GROUPS = [
  {
    id: "identification",
    title: "Identificação",
    icon: "id-card-outline",
    fields: [
      "tipo",
      "fabricante",
      "modelo",
      "numeroSerie",
      "codigoPatrimonial",
    ],
  },
  {
    id: "location",
    title: "Localização e Status",
    icon: "pin-outline",
    fields: [
      "setorAtual",
      "statusOperacional",
      "criticidade",
      "responsavelTecnico",
    ],
  },
  {
    id: "acquisition",
    title: "Aquisição",
    icon: "calendar-outline",
    fields: [
      "dataAquisicao",
      "valorAquisicao",
      "dataFimGarantia",
      "vidaUtilEstimativa",
    ],
  },
  {
    id: "maintenance",
    title: "Manutenção",
    icon: "construct-outline",
    fields: ["dataUltimaManutencao", "dataProximaManutencao"],
  },
  {
    id: "regulatory",
    title: "Regulatório",
    icon: "shield-checkmark-outline",
    fields: ["registroAnvisa", "classeRisco"],
  },
  {
    id: "audit",
    title: "Auditoria",
    icon: "time-outline",
    fields: ["userId", "createdAt", "updatedAt"],
  },
];

const formatDate = (value) => {
  if (!value) return "Não informado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
};

const getStatusInfo = (status) => STATUS_INFO[status] || STATUS_INFO.DEFAULT;

const formatStatus = (status) => getStatusInfo(status).label;

const formatCurrency = (value) =>
  value === undefined || value === null
    ? "Não informado"
    : `R$ ${Number(value).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`;

const formatValue = (field, value) => {
  if (!value && value !== 0) {
    return "Não informado";
  }

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
    return formatDate(value);
  }

  if (field === "valorAquisicao") {
    return formatCurrency(value);
  }

  if (field === "vidaUtilEstimativa") {
    return `${value} ano${Number(value) === 1 ? "" : "s"}`;
  }

  if (field === "statusOperacional") {
    return formatStatus(value);
  }

  return value;
};

const EquipmentDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

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

  const statusInfo = getStatusInfo(equipment.statusOperacional);

  const heroSubtitle =
    [equipment.fabricante, equipment.modelo].filter(Boolean).join(" • ") ||
    "Detalhes do equipamento";

  const quickHighlights = [
    equipment.codigoPatrimonial && {
      id: "code",
      icon: "qr-code-outline",
      label: "Código patrimonial",
      value: equipment.codigoPatrimonial,
    },
    equipment.setorAtual && {
      id: "sector",
      icon: "business-outline",
      label: "Setor atual",
      value: equipment.setorAtual,
    },
    equipment.modelo && {
      id: "model",
      icon: "hardware-chip-outline",
      label: "Modelo",
      value: equipment.modelo,
    },
  ].filter(Boolean);

  const observations = equipment.observacoes?.trim();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={theme.colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.heroGradient,
            { paddingTop: insets.top + theme.spacing.md },
          ]}
        >
          <View style={styles.heroContentWrapper}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroIconWrapper}>
                <Ionicons
                  name="medkit-outline"
                  size={26}
                  color={theme.colors.white}
                />
              </View>
              <View style={styles.heroTextGroup}>
                <Text style={styles.heroTitle}>{equipment.nome}</Text>
                <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>
              </View>
              <TouchableOpacity
                style={styles.heroActionButton}
                onPress={() => setStatusModalVisible(true)}
              >
                <Ionicons
                  name="sync-outline"
                  size={22}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.heroHighlights}>
              <View style={styles.heroHighlight}>
                <Text style={styles.heroHighlightValue}>
                  {formatStatus(equipment.statusOperacional)}
                </Text>
                <View style={styles.heroHighlightDivider} />
                <Text style={styles.heroHighlightLabel}>Status atual</Text>
              </View>
              <View style={styles.heroHighlight}>
                <Text style={styles.heroHighlightValue}>
                  {formatDate(equipment.updatedAt)}
                </Text>
                <View style={styles.heroHighlightDivider} />
                <Text style={styles.heroHighlightLabel}>
                  Última atualização
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {quickHighlights.length > 0 && (
          <View style={styles.quickInfoGrid}>
            {quickHighlights.map((item) => (
              <View key={item.id} style={styles.quickInfoCard}>
                <View style={styles.quickIconWrapper}>
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.quickValue}>{item.value}</Text>
                  <Text style={styles.quickLabel}>{item.label}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {DETAIL_GROUPS.map((group) => {
          const items = group.fields.map((field) => {
            const rawValue = equipment[field];
            const value = formatValue(field, rawValue);
            const isEmpty = !rawValue && rawValue !== 0;
            return {
              field,
              label: LABELS[field] ?? field,
              value,
              isEmpty,
            };
          });

          const hasContent = items.some((item) => !item.isEmpty);
          if (!hasContent) {
            return null;
          }

          return (
            <View key={group.id} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <View style={styles.sectionIcon}>
                    <Ionicons
                      name={group.icon}
                      size={18}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text style={styles.sectionTitle}>{group.title}</Text>
                </View>
              </View>

              <View style={styles.sectionBody}>
                {items.map((item) => (
                  <View key={item.field} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{item.label}</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        item.isEmpty && styles.detailValueEmpty,
                      ]}
                    >
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {observations && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.sectionIcon}>
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.sectionTitle}>Observações</Text>
              </View>
            </View>
            <Text style={styles.observationText}>{observations}</Text>
          </View>
        )}

        <View style={styles.actionsCard}>
          <View style={styles.actionsHeader}>
            <Text style={styles.actionsTitle}>Ações rápidas</Text>
            <Text style={styles.actionsSubtitle}>
              Gerencie o equipamento com as opções abaixo
            </Text>
          </View>

          <View style={styles.actionsList}>
            <TouchableOpacity
              style={styles.actionListItem}
              onPress={() => setStatusModalVisible(true)}
            >
              <View style={[styles.actionIcon, styles.actionIconPrimary]}>
                <Ionicons
                  name="sync-outline"
                  size={18}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.actionTextGroup}>
                <Text style={[styles.actionLabel, styles.actionLabelPrimary]}>
                  Atualizar status
                </Text>
                <Text style={styles.actionDescription}>
                  Mantenha o status operacional em dia
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionListItem}
              onPress={handleEdit}
            >
              <View style={[styles.actionIcon, styles.actionIconInfo]}>
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={theme.colors.info}
                />
              </View>
              <View style={styles.actionTextGroup}>
                <Text style={[styles.actionLabel, styles.actionLabelInfo]}>
                  Editar dados
                </Text>
                <Text style={styles.actionDescription}>
                  Atualize informações do equipamento
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionListItemDanger}
              onPress={handleDelete}
            >
              <View style={[styles.actionIcon, styles.actionIconDanger]}>
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={theme.colors.error}
                />
              </View>
              <View style={styles.actionTextGroup}>
                <Text style={[styles.actionLabel, styles.actionLabelDanger]}>
                  Excluir
                </Text>
                <Text style={styles.actionDescription}>
                  Remove definitivamente este equipamento
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
              const statusInfo = STATUS_INFO[status] || STATUS_INFO.DEFAULT;
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
                  <View
                    style={[
                      styles.statusOptionIcon,
                      { backgroundColor: statusInfo.background },
                    ]}
                  >
                    <Ionicons
                      name={statusInfo.icon}
                      size={20}
                      color={statusInfo.color}
                    />
                  </View>
                  <Text
                    style={[
                      styles.statusOptionText,
                      selected && styles.statusOptionTextSelected,
                    ]}
                  >
                    {statusInfo.label}
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.lg,
  },
  heroGradient: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderBottomLeftRadius: theme.borderRadius.xxl,
    borderBottomRightRadius: theme.borderRadius.xxl,
    overflow: "hidden",
    ...theme.shadows.lg,
  },
  heroContentWrapper: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  heroIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.white + "20",
  },
  heroTextGroup: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  heroActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  heroHighlights: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  heroHighlight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  heroHighlightDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  heroHighlightValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.white,
    textAlign: "center",
  },
  heroHighlightLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },
  quickInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
  },
  quickInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.white,
    flexBasis: "48%",
    flexGrow: 1,
    ...theme.shadows.sm,
  },
  quickIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary + "15",
  },
  quickValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  quickLabel: {
    marginTop: 2,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  sectionCard: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadows.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary + "15",
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  sectionBody: {
    gap: theme.spacing.md,
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  detailValueEmpty: {
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  observationText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  actionsCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxl,
    gap: theme.spacing.md,
    ...theme.shadows.md,
  },
  actionsHeader: {
    gap: theme.spacing.xs,
  },
  actionsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  actionsSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  actionsList: {
    gap: theme.spacing.sm,
  },
  actionListItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  actionListItemDanger: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.error + "40",
    ...theme.shadows.sm,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIconPrimary: {
    backgroundColor: theme.colors.primary + "12",
  },
  actionIconInfo: {
    backgroundColor: theme.colors.info + "15",
  },
  actionIconDanger: {
    backgroundColor: theme.colors.error + "15",
  },
  actionTextGroup: {
    flex: 1,
    gap: 2,
  },
  actionLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  actionLabelPrimary: {
    color: theme.colors.primary,
  },
  actionLabelInfo: {
    color: theme.colors.info,
  },
  actionLabelDanger: {
    color: theme.colors.error,
  },
  actionDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
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
    gap: theme.spacing.sm,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
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
  },
  statusOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "15",
  },
  statusOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
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

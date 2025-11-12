import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { equipmentApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import theme from "../styles/theme";

const STATUS_OPTIONS = [
  "DISPONIVEL",
  "EM_USO",
  "EM_MANUTENCAO",
  "INATIVO",
  "SUCATEADO",
];

const STATUS_LABELS = {
  DISPONIVEL: "Disponível",
  EM_USO: "Em uso",
  EM_MANUTENCAO: "Em manutenção",
  INATIVO: "Inativo",
  SUCATEADO: "Sucateado",
};

const formatStatusLabel = (status) =>
  STATUS_LABELS[status] || status?.replace(/_/g, " ") || "—";

const formatDateDisplay = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
};

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isValidISODate = (value) => {
  if (!ISO_DATE_REGEX.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map((part) => Number(part));
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const mapEquipmentToForm = (equipment) => {
  const source = equipment ?? {};

  return {
    nome: source.nome || "",
    tipo: source.tipo || "",
    fabricante: source.fabricante || "",
    modelo: source.modelo || "",
    statusOperacional: source.statusOperacional || "DISPONIVEL",
    numeroSerie: source.numeroSerie || "",
    codigoPatrimonial: source.codigoPatrimonial || "",
    setorAtual: source.setorAtual || "",
    dataAquisicao: source.dataAquisicao
      ? source.dataAquisicao.slice(0, 10)
      : "",
    valorAquisicao:
      source.valorAquisicao !== undefined && source.valorAquisicao !== null
        ? String(source.valorAquisicao)
        : "",
    dataFimGarantia: source.dataFimGarantia
      ? source.dataFimGarantia.slice(0, 10)
      : "",
    vidaUtilEstimativa:
      source.vidaUtilEstimativa !== undefined &&
      source.vidaUtilEstimativa !== null
        ? String(source.vidaUtilEstimativa)
        : "",
    registroAnvisa: source.registroAnvisa || "",
    classeRisco: source.classeRisco || "",
    dataUltimaManutencao: source.dataUltimaManutencao
      ? source.dataUltimaManutencao.slice(0, 10)
      : "",
    dataProximaManutencao: source.dataProximaManutencao
      ? source.dataProximaManutencao.slice(0, 10)
      : "",
    responsavelTecnico: source.responsavelTecnico || "",
    criticidade: source.criticidade || "",
    observacoes: source.observacoes || "",
  };
};

const INITIAL_FORM = {
  nome: "",
  tipo: "",
  fabricante: "",
  modelo: "",
  statusOperacional: "DISPONIVEL",
  numeroSerie: "",
  codigoPatrimonial: "",
  setorAtual: "",
  dataAquisicao: "",
  valorAquisicao: "",
  dataFimGarantia: "",
  vidaUtilEstimativa: "",
  registroAnvisa: "",
  classeRisco: "",
  dataUltimaManutencao: "",
  dataProximaManutencao: "",
  responsavelTecnico: "",
  criticidade: "",
  observacoes: "",
};

const EquipmentFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const mode = route.params?.mode ?? "create";
  const equipmentId = route.params?.equipmentId ?? null;
  const equipmentFromParams = route.params?.equipment ?? null;

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [equipmentDetails, setEquipmentDetails] = useState(equipmentFromParams);
  const [loading, setLoading] = useState(
    mode === "edit" && !equipmentFromParams
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const hydrateForm = (equipment) => {
      if (!equipment) return;

      setFormData(mapEquipmentToForm(equipment));
      setEquipmentDetails(equipment);
    };

    if (mode === "edit") {
      if (equipmentFromParams) {
        hydrateForm(equipmentFromParams);
        setLoading(false);
      } else if (equipmentId) {
        const fetchDetails = async () => {
          try {
            const data = await equipmentApi.getById(equipmentId);
            hydrateForm(data);
          } catch (error) {
            console.error("Erro ao carregar equipamento:", error);
            Alert.alert(
              "Erro",
              error?.message ||
                error?.data?.message ||
                "Não foi possível carregar o equipamento para edição."
            );
            navigation.goBack();
          } finally {
            setLoading(false);
          }
        };
        fetchDetails();
      }
    }
  }, [mode, equipmentId, equipmentFromParams, navigation]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetForm = () => {
    if (mode === "edit" && equipmentDetails) {
      setFormData(mapEquipmentToForm(equipmentDetails));
    } else {
      setFormData({ ...INITIAL_FORM });
    }
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      Alert.alert("Erro", "Informe o nome do equipamento.");
      return false;
    }

    if (!formData.tipo.trim()) {
      Alert.alert("Erro", "Informe o tipo do equipamento.");
      return false;
    }

    if (!formData.fabricante.trim()) {
      Alert.alert("Erro", "Informe o fabricante do equipamento.");
      return false;
    }

    if (!formData.modelo.trim()) {
      Alert.alert("Erro", "Informe o modelo do equipamento.");
      return false;
    }

    if (!formData.statusOperacional) {
      Alert.alert("Erro", "Selecione o status operacional.");
      return false;
    }

    if (
      formData.valorAquisicao &&
      Number.isNaN(Number.parseFloat(formData.valorAquisicao))
    ) {
      Alert.alert("Erro", "Valor de aquisição inválido.");
      return false;
    }

    if (
      formData.vidaUtilEstimativa &&
      (Number.isNaN(Number.parseInt(formData.vidaUtilEstimativa, 10)) ||
        Number.parseInt(formData.vidaUtilEstimativa, 10) <= 0)
    ) {
      Alert.alert(
        "Erro",
        "Vida útil estimada deve ser um número inteiro positivo."
      );
      return false;
    }

    const dateFields = [
      "dataAquisicao",
      "dataFimGarantia",
      "dataUltimaManutencao",
      "dataProximaManutencao",
    ];

    for (const field of dateFields) {
      const value = formData[field];
      if (value && !isValidISODate(value)) {
        Alert.alert("Erro", `${field} deve estar no formato AAAA-MM-DD.`);
        return false;
      }
    }

    return true;
  };

  const buildPayload = () => {
    const payload = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        return;
      }

      if (key === "valorAquisicao") {
        payload[key] = Number.parseFloat(value);
        return;
      }

      if (key === "vidaUtilEstimativa") {
        payload[key] = Number.parseInt(value, 10);
        return;
      }

      payload[key] = value;
    });

    if (mode === "create" && user?.id) {
      payload.userId = user.id;
    }

    return payload;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      const payload = buildPayload();
      if (mode === "create") {
        const created = await equipmentApi.create(payload);
        Alert.alert("Sucesso", "Equipamento criado com sucesso!", [
          {
            text: "OK",
            onPress: () =>
              navigation.replace("EquipmentDetail", {
                equipmentId: created.id ?? created?.data?.id,
                equipment: created,
                refreshTimestamp: Date.now(),
              }),
          },
        ]);
      } else if (equipmentId) {
        const updated = await equipmentApi.update(equipmentId, payload);
        Alert.alert("Sucesso", "Equipamento atualizado com sucesso!", [
          {
            text: "OK",
            onPress: () =>
              navigation.replace("EquipmentDetail", {
                equipmentId,
                equipment: updated,
                refreshTimestamp: Date.now(),
              }),
          },
        ]);
      }
    } catch (error) {
      console.error("Erro ao salvar equipamento:", error);
      Alert.alert(
        "Erro",
        error?.message ||
          error?.data?.message ||
          "Não foi possível salvar o equipamento."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando equipamento...</Text>
      </SafeAreaView>
    );
  }

  const heroTitle =
    mode === "create" ? "Cadastrar equipamento" : "Editar equipamento";
  const heroSubtitle =
    mode === "create"
      ? "Preencha os dados obrigatórios para registrar um novo item."
      : equipmentDetails?.codigoPatrimonial
      ? `Código patrimonial · ${equipmentDetails.codigoPatrimonial}`
      : "Atualize as informações deste equipamento.";

  const heroHighlights =
    mode === "create"
      ? []
      : [
          {
            id: "status",
            label: "Status atual",
            value: formatStatusLabel(formData.statusOperacional),
          },
          {
            id: "updated",
            label: "Atualizado",
            value: formatDateDisplay(equipmentDetails?.updatedAt),
          },
        ];

  const renderStatusOption = (status) => {
    const selected = formData.statusOperacional === status;
    return (
      <TouchableOpacity
        key={status}
        style={[styles.statusChip, selected && styles.statusChipSelected]}
        onPress={() => handleInputChange("statusOperacional", status)}
      >
        <Text
          style={[
            styles.statusChipText,
            selected && styles.statusChipTextSelected,
          ]}
        >
          {status.replace(/_/g, " ")}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTextInput = (field, label, props = {}, options = {}) => {
    const { size = "full", inputStyle } = options;
    return (
      <View
        key={field}
        style={[
          styles.inputContainer,
          size === "half" && styles.inputContainerHalf,
        ]}
      >
        {!!label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, inputStyle]}
            value={formData[field]}
            onChangeText={(text) => handleInputChange(field, text)}
            placeholderTextColor={theme.colors.textSecondary}
            {...props}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={theme.colors.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContentWrapper}>
              <View style={styles.heroTopRow}>
                <TouchableOpacity
                  style={styles.heroBackButton}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons
                    name="arrow-back"
                    size={22}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
                <View style={styles.heroTextGroup}>
                  <Text style={styles.heroTitle}>{heroTitle}</Text>
                  <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>
                </View>
              </View>

              <View style={styles.heroHighlights}>
                {heroHighlights.map((item) => (
                  <View key={item.id} style={styles.heroHighlight}>
                    <Text style={styles.heroHighlightValue}>{item.value}</Text>
                    <View style={styles.heroHighlightDivider} />
                    <Text style={styles.heroHighlightLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formCardHeader}>
            <View style={styles.formCardIcon}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.formCardTitle}>Informações básicas</Text>
          </View>
          <View style={styles.formGrid}>
            {renderTextInput("nome", "Nome *", {
              placeholder: "Ex: Monitor Multiparamétrico",
            })}
            {renderTextInput(
              "tipo",
              "Tipo *",
              {
                placeholder: "Ex: Monitor de Sinais Vitais",
              },
              { size: "half" }
            )}
            {renderTextInput(
              "fabricante",
              "Fabricante *",
              {
                placeholder: "Ex: Philips",
              },
              { size: "half" }
            )}
            {renderTextInput(
              "modelo",
              "Modelo *",
              {
                placeholder: "Ex: MX450",
              },
              { size: "half" }
            )}
          </View>

          <Text style={styles.formCardSubtitle}>Status operacional *</Text>
          <View style={styles.statusChipsRow}>
            {STATUS_OPTIONS.map(renderStatusOption)}
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formCardHeader}>
            <View style={styles.formCardIcon}>
              <Ionicons
                name="pricetag-outline"
                size={18}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.formCardTitle}>Identificação</Text>
          </View>
          <View style={styles.formGrid}>
            {renderTextInput(
              "numeroSerie",
              "Número de série",
              {
                placeholder: "SN123456",
              },
              { size: "half" }
            )}
            {renderTextInput(
              "codigoPatrimonial",
              "Código patrimonial",
              {
                placeholder: "PAT-2025-001",
              },
              { size: "half" }
            )}
            {renderTextInput(
              "setorAtual",
              "Setor atual",
              {
                placeholder: "Ex: UTI",
              },
              { size: "half" }
            )}
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formCardHeader}>
            <View style={styles.formCardIcon}>
              <Ionicons
                name="card-outline"
                size={18}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.formCardTitle}>Aquisição</Text>
          </View>
          <View style={styles.formGrid}>
            {renderTextInput(
              "dataAquisicao",
              "Data de aquisição",
              {
                placeholder: "AAAA-MM-DD",
              },
              { size: "half" }
            )}
            {renderTextInput(
              "valorAquisicao",
              "Valor de aquisição",
              {
                placeholder: "Ex: 15000.00",
                keyboardType: "decimal-pad",
              },
              { size: "half" }
            )}
            {renderTextInput(
              "dataFimGarantia",
              "Fim da garantia",
              {
                placeholder: "AAAA-MM-DD",
              },
              { size: "half" }
            )}
            {renderTextInput(
              "vidaUtilEstimativa",
              "Vida útil estimada (anos)",
              {
                placeholder: "Ex: 10",
                keyboardType: "numeric",
              },
              { size: "half" }
            )}
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formCardHeader}>
            <View style={styles.formCardIcon}>
              <Ionicons
                name="construct-outline"
                size={18}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.formCardTitle}>Manutenção</Text>
          </View>
          <View style={styles.formGrid}>
            {renderTextInput(
              "dataUltimaManutencao",
              "Última manutenção",
              {
                placeholder: "AAAA-MM-DD",
              },
              { size: "half" }
            )}
            {renderTextInput(
              "dataProximaManutencao",
              "Próxima manutenção",
              {
                placeholder: "AAAA-MM-DD",
              },
              { size: "half" }
            )}
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formCardHeader}>
            <View style={styles.formCardIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.formCardTitle}>
              Regulatório e responsabilidade
            </Text>
          </View>
          <View style={styles.formGrid}>
            {renderTextInput(
              "registroAnvisa",
              "Registro ANVISA",
              {
                placeholder: "Ex: 80100470106",
              },
              { size: "half" }
            )}
            {renderTextInput(
              "classeRisco",
              "Classe de risco",
              {
                placeholder: "Ex: Classe II",
              },
              { size: "half" }
            )}
            {renderTextInput(
              "responsavelTecnico",
              "Responsável técnico",
              {
                placeholder: "Ex: Dr. João Silva",
              },
              { size: "half" }
            )}
            {renderTextInput(
              "criticidade",
              "Criticidade",
              {
                placeholder: "Ex: Alta",
              },
              { size: "half" }
            )}
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formCardHeader}>
            <View style={styles.formCardIcon}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.formCardTitle}>Observações</Text>
          </View>
          {renderTextInput(
            "observacoes",
            "Observações",
            {
              placeholder: "Observações adicionais sobre o equipamento",
              multiline: true,
              numberOfLines: 4,
              textAlignVertical: "top",
            },
            { inputStyle: styles.textArea }
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + theme.spacing.sm },
        ]}
      >
        <TouchableOpacity
          style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <>
              <Ionicons
                name="save-outline"
                size={20}
                color={theme.colors.white}
              />
              <Text style={styles.saveButtonText}>
                {mode === "create" ? "Cadastrar" : "Salvar alterações"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  heroContainer: {
    marginHorizontal: -theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xxl,
  },
  heroGradient: {
    width: "100%",
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
    paddingTop: theme.spacing.md,
  },
  heroBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.white,
  },
  heroTextGroup: {
    flex: 1,
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
  },
  heroTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    textAlign: "left",
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: "rgba(255,255,255,0.85)",
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
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  heroHighlightDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  heroHighlightValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.white,
    textAlign: "center",
    minWidth: 40,
  },
  heroHighlightLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    flexShrink: 1,
  },
  formCard: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
    ...theme.shadows.md,
  },
  formCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  formCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary + "12",
  },
  formCardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  formCardSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  inputContainer: {
    width: "100%",
  },
  inputContainerHalf: {
    flexBasis: "48%",
    flexGrow: 1,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    paddingHorizontal: theme.spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  statusChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  statusChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    backgroundColor: theme.colors.white,
  },
  statusChipSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "15",
  },
  statusChipText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
  statusChipTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  bottomBar: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
    backgroundColor: theme.colors.white,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.md,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default EquipmentFormScreen;

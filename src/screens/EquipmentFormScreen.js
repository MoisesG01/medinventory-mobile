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
import { useNavigation, useRoute } from "@react-navigation/native";
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
  const { user } = useAuth();

  const mode = route.params?.mode ?? "create";
  const equipmentId = route.params?.equipmentId ?? null;
  const equipmentFromParams = route.params?.equipment ?? null;

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(mode === "edit" && !equipmentFromParams);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const hydrateForm = (equipment) => {
      if (!equipment) return;

      setFormData({
        nome: equipment.nome || "",
        tipo: equipment.tipo || "",
        fabricante: equipment.fabricante || "",
        modelo: equipment.modelo || "",
        statusOperacional: equipment.statusOperacional || "DISPONIVEL",
        numeroSerie: equipment.numeroSerie || "",
        codigoPatrimonial: equipment.codigoPatrimonial || "",
        setorAtual: equipment.setorAtual || "",
        dataAquisicao: equipment.dataAquisicao
          ? equipment.dataAquisicao.slice(0, 10)
          : "",
        valorAquisicao:
          equipment.valorAquisicao !== undefined &&
          equipment.valorAquisicao !== null
            ? String(equipment.valorAquisicao)
            : "",
        dataFimGarantia: equipment.dataFimGarantia
          ? equipment.dataFimGarantia.slice(0, 10)
          : "",
        vidaUtilEstimativa:
          equipment.vidaUtilEstimativa !== undefined &&
          equipment.vidaUtilEstimativa !== null
            ? String(equipment.vidaUtilEstimativa)
            : "",
        registroAnvisa: equipment.registroAnvisa || "",
        classeRisco: equipment.classeRisco || "",
        dataUltimaManutencao: equipment.dataUltimaManutencao
          ? equipment.dataUltimaManutencao.slice(0, 10)
          : "",
        dataProximaManutencao: equipment.dataProximaManutencao
          ? equipment.dataProximaManutencao.slice(0, 10)
          : "",
        responsavelTecnico: equipment.responsavelTecnico || "",
        criticidade: equipment.criticidade || "",
        observacoes: equipment.observacoes || "",
      });
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
      Alert.alert("Erro", "Vida útil estimada deve ser um número inteiro positivo.");
      return false;
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

  const renderStatusOption = (status) => {
    const selected = formData.statusOperacional === status;
    return (
      <TouchableOpacity
        key={status}
        style={[
          styles.statusChip,
          selected && styles.statusChipSelected,
        ]}
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

  const renderTextInput = (field, label, props = {}) => (
    <View style={styles.inputContainer} key={field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={formData[field]}
          onChangeText={(text) => handleInputChange(field, text)}
          placeholderTextColor={theme.colors.textSecondary}
          {...props}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === "create" ? "Novo Equipamento" : "Editar Equipamento"}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações obrigatórias</Text>
          {renderTextInput("nome", "Nome *", {
            placeholder: "Ex: Monitor Multiparamétrico",
          })}
          {renderTextInput("tipo", "Tipo *", {
            placeholder: "Ex: Monitor de Sinais Vitais",
          })}
          {renderTextInput("fabricante", "Fabricante *", {
            placeholder: "Ex: Philips",
          })}
          {renderTextInput("modelo", "Modelo *", {
            placeholder: "Ex: MX450",
          })}

          <Text style={[styles.label, { marginTop: theme.spacing.md }]}>
            Status Operacional *
          </Text>
          <View style={styles.statusChipsRow}>
            {STATUS_OPTIONS.map(renderStatusOption)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações adicionais</Text>
          {renderTextInput("numeroSerie", "Número de Série", {
            placeholder: "SN123456",
          })}
          {renderTextInput("codigoPatrimonial", "Código Patrimonial", {
            placeholder: "PAT-2024-001",
          })}
          {renderTextInput("setorAtual", "Setor atual", {
            placeholder: "Ex: UTI",
          })}
          {renderTextInput("dataAquisicao", "Data de aquisição", {
            placeholder: "AAAA-MM-DD",
          })}
          {renderTextInput("valorAquisicao", "Valor de aquisição", {
            placeholder: "Ex: 15000.00",
            keyboardType: "decimal-pad",
          })}
          {renderTextInput("dataFimGarantia", "Fim da garantia", {
            placeholder: "AAAA-MM-DD",
          })}
          {renderTextInput("vidaUtilEstimativa", "Vida útil estimada (anos)", {
            placeholder: "Ex: 10",
            keyboardType: "numeric",
          })}
          {renderTextInput("registroAnvisa", "Registro ANVISA", {
            placeholder: "Ex: 80100470106",
          })}
          {renderTextInput("classeRisco", "Classe de risco", {
            placeholder: "Ex: Classe II",
          })}
          {renderTextInput(
            "dataUltimaManutencao",
            "Data da última manutenção",
            {
              placeholder: "AAAA-MM-DD",
            }
          )}
          {renderTextInput(
            "dataProximaManutencao",
            "Data da próxima manutenção",
            {
              placeholder: "AAAA-MM-DD",
            }
          )}
          {renderTextInput("responsavelTecnico", "Responsável técnico", {
            placeholder: "Ex: Dr. João Silva",
          })}
          {renderTextInput("criticidade", "Criticidade", {
            placeholder: "Ex: Alta",
          })}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Observações</Text>
            <View style={[styles.inputWrapper, { height: 120, alignItems: "flex-start" }]}>
              <TextInput
                style={[styles.input, { height: "100%", textAlignVertical: "top" }]}
                value={formData.observacoes}
                onChangeText={(text) => handleInputChange("observacoes", text)}
                placeholder="Observações adicionais sobre o equipamento"
                placeholderTextColor={theme.colors.textSecondary}
                multiline
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color={theme.colors.white} />
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
    backgroundColor: theme.colors.gray100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  section: {
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxl,
    ...theme.shadows.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
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
  statusChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
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
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
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


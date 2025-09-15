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
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import theme from "../styles/theme";

const { width } = Dimensions.get("window");

const ReportsScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState("30d");
  const navigation = useNavigation();

  const reportCategories = [
    {
      id: "inventory",
      title: "Inventário",
      description: "Relatórios de ativos e estoque",
      icon: "cube-outline",
      color: theme.colors.primary,
      reports: [
        {
          name: "Inventário Completo",
          description: "Lista todos os ativos cadastrados",
        },
        {
          name: "Ativos por Localização",
          description: "Distribuição geográfica dos equipamentos",
        },
        {
          name: "Ativos por Categoria",
          description: "Agrupamento por tipo de equipamento",
        },
      ],
    },
    {
      id: "maintenance",
      title: "Manutenção",
      description: "Relatórios de manutenção e calibração",
      icon: "construct-outline",
      color: theme.colors.warning,
      reports: [
        {
          name: "Manutenções Pendentes",
          description: "Equipamentos que precisam de manutenção",
        },
        {
          name: "Histórico de Manutenções",
          description: "Registro de todas as manutenções realizadas",
        },
        {
          name: "Custos de Manutenção",
          description: "Análise financeira das manutenções",
        },
      ],
    },
    {
      id: "compliance",
      title: "Conformidade",
      description: "Relatórios de certificações e vencimentos",
      icon: "shield-checkmark-outline",
      color: theme.colors.success,
      reports: [
        {
          name: "Certificações Vencidas",
          description: "Equipamentos com certificações expiradas",
        },
        {
          name: "Próximos Vencimentos",
          description: "Certificações que vencem em breve",
        },
        {
          name: "Status de Conformidade",
          description: "Visão geral da conformidade",
        },
      ],
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "Relatórios analíticos e métricas",
      icon: "bar-chart-outline",
      color: theme.colors.info,
      reports: [
        {
          name: "Utilização de Equipamentos",
          description: "Análise de uso dos ativos",
        },
        {
          name: "Tendências de Manutenção",
          description: "Padrões e tendências identificadas",
        },
        { name: "ROI dos Ativos", description: "Retorno sobre investimento" },
      ],
    },
  ];

  const quickReports = [
    {
      id: "executive",
      title: "Dashboard Executivo",
      description: "Visão geral para gestão",
      icon: "trending-up-outline",
      color: theme.colors.primary,
      lastGenerated: "2 horas atrás",
      frequency: "Diário",
    },
    {
      id: "emergency",
      title: "Relatório de Emergência",
      description: "Equipamentos críticos disponíveis",
      icon: "medical-outline",
      color: theme.colors.error,
      lastGenerated: "1 hora atrás",
      frequency: "Tempo real",
    },
    {
      id: "financial",
      title: "Relatório Financeiro",
      description: "Custos e investimentos",
      icon: "cash-outline",
      color: theme.colors.success,
      lastGenerated: "Ontem",
      frequency: "Semanal",
    },
    {
      id: "maintenance",
      title: "Status de Manutenção",
      description: "Equipamentos em manutenção",
      icon: "construct-outline",
      color: theme.colors.warning,
      lastGenerated: "3 horas atrás",
      frequency: "Diário",
    },
  ];

  const filterOptions = [
    { id: "all", label: "Todos", icon: "grid-outline" },
    { id: "inventory", label: "Inventário", icon: "cube-outline" },
    { id: "maintenance", label: "Manutenção", icon: "construct-outline" },
    {
      id: "compliance",
      label: "Conformidade",
      icon: "shield-checkmark-outline",
    },
    { id: "analytics", label: "Analytics", icon: "bar-chart-outline" },
  ];

  const dateRangeOptions = [
    { id: "7d", label: "Últimos 7 dias" },
    { id: "30d", label: "Últimos 30 dias" },
    { id: "90d", label: "Últimos 90 dias" },
    { id: "1y", label: "Último ano" },
    { id: "custom", label: "Personalizado" },
  ];

  const recentReports = [
    {
      id: 1,
      name: "Inventário Completo",
      category: "Inventário",
      generatedAt: "2024-01-15 14:30",
      size: "2.3 MB",
      format: "PDF",
      status: "Concluído",
    },
    {
      id: 2,
      name: "Manutenções Pendentes",
      category: "Manutenção",
      generatedAt: "2024-01-15 12:15",
      size: "1.8 MB",
      format: "Excel",
      status: "Concluído",
    },
    {
      id: 3,
      name: "Dashboard Executivo",
      category: "Analytics",
      generatedAt: "2024-01-15 09:45",
      size: "3.1 MB",
      format: "PDF",
      status: "Concluído",
    },
    {
      id: 4,
      name: "Certificações Vencidas",
      category: "Conformidade",
      generatedAt: "2024-01-14 16:20",
      size: "1.2 MB",
      format: "PDF",
      status: "Concluído",
    },
  ];

  const handleGenerateReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleExportReport = (format) => {
    Alert.alert(
      "Exportar Relatório",
      `Relatório exportado em formato ${format} com sucesso!`,
      [{ text: "OK" }]
    );
    setShowExportModal(false);
  };

  const handleScheduleReport = (report) => {
    Alert.alert(
      "Agendar Relatório",
      `Relatório "${report.title}" agendado com sucesso!`,
      [{ text: "OK" }]
    );
  };

  const handleViewReport = (report) => {
    Alert.alert(
      "Visualizar Relatório",
      `Abrindo relatório "${report.name}"...`,
      [{ text: "OK" }]
    );
  };

  const handleDownloadReport = (report) => {
    Alert.alert("Download", `Baixando relatório "${report.name}"...`, [
      { text: "OK" },
    ]);
  };

  const filteredCategories = reportCategories.filter((category) => {
    return selectedFilter === "all" || category.id === selectedFilter;
  });

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

  const ReportCategory = ({ category }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <View
          style={[
            styles.categoryIcon,
            { backgroundColor: category.color + "20" },
          ]}
        >
          <Ionicons name={category.icon} size={24} color={category.color} />
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.reportsList}>
        {category.reports.map((report, index) => (
          <TouchableOpacity
            key={index}
            style={styles.reportItem}
            onPress={() => handleGenerateReport(report)}
          >
            <View style={styles.reportInfo}>
              <Text style={styles.reportName}>{report.name}</Text>
              <Text style={styles.reportDescription}>{report.description}</Text>
            </View>
            <View style={styles.reportActions}>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={() => handleGenerateReport(report)}
              >
                <Ionicons
                  name="play-outline"
                  size={16}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={() => handleScheduleReport(report)}
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={theme.colors.warning}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const QuickReportCard = ({ report }) => (
    <TouchableOpacity
      style={styles.quickReportCard}
      onPress={() => handleGenerateReport(report)}
    >
      <View style={styles.quickReportContent}>
        {/* Header com ícone e status */}
        <View style={styles.quickReportHeader}>
          <View
            style={[
              styles.quickReportIcon,
              { backgroundColor: report.color + "15" },
            ]}
          >
            <Ionicons name={report.icon} size={24} color={report.color} />
          </View>
          <View style={styles.quickReportHeaderInfo}>
            <Text style={styles.quickReportTitle}>{report.title}</Text>
            <View
              style={[
                styles.quickReportStatus,
                { backgroundColor: report.color + "10" },
              ]}
            >
              <View
                style={[
                  styles.quickReportStatusDot,
                  { backgroundColor: report.color },
                ]}
              />
              <Text
                style={[styles.quickReportStatusText, { color: report.color }]}
              >
                Ativo
              </Text>
            </View>
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.quickReportBody}>
          <Text style={styles.quickReportDescription}>
            {report.description}
          </Text>
        </View>

        {/* Footer com informações e botão */}
        <View style={styles.quickReportFooter}>
          <View style={styles.quickReportMeta}>
            <View style={styles.quickReportMetaItem}>
              <Ionicons
                name="time-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.quickReportMetaText}>
                {report.lastGenerated}
              </Text>
            </View>
            <View style={styles.quickReportMetaItem}>
              <Ionicons
                name="refresh-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.quickReportMetaText}>{report.frequency}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.quickReportButton,
              { backgroundColor: report.color },
            ]}
            onPress={() => handleGenerateReport(report)}
          >
            <Ionicons
              name="arrow-forward"
              size={18}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const RecentReportItem = ({ report }) => (
    <TouchableOpacity
      style={styles.recentReportItem}
      onPress={() => handleViewReport(report)}
    >
      <View style={styles.recentReportInfo}>
        <Text style={styles.recentReportName}>{report.name}</Text>
        <Text style={styles.recentReportCategory}>{report.category}</Text>
        <Text style={styles.recentReportDate}>{report.generatedAt}</Text>
      </View>
      <View style={styles.recentReportRight}>
        <View style={styles.recentReportMeta}>
          <Text style={styles.recentReportSize}>{report.size}</Text>
          <View
            style={[
              styles.recentReportFormat,
              { backgroundColor: getFormatColor(report.format) },
            ]}
          >
            <Text style={styles.recentReportFormatText}>{report.format}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.recentReportDownload}
          onPress={() => handleDownloadReport(report)}
        >
          <Ionicons
            name="download-outline"
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getFormatColor = (format) => {
    switch (format) {
      case "PDF":
        return theme.colors.error + "20";
      case "Excel":
        return theme.colors.success + "20";
      case "CSV":
        return theme.colors.info + "20";
      default:
        return theme.colors.gray300;
    }
  };

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
          <Text style={styles.headerTitle}>Relatórios</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Ionicons
                name="filter-outline"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowExportModal(true)}
            >
              <Ionicons
                name="download-outline"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsSummary}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Relatórios</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Agendados</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Ativos</Text>
            </View>
          </View>
        </View>

        {/* Quick Reports */}
        <View style={styles.quickReportsContainer}>
          <Text style={styles.sectionTitle}>Relatórios Rápidos</Text>
          <View style={styles.quickReportsList}>
            {quickReports.map((report, index) => (
              <QuickReportCard key={index} report={report} />
            ))}
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterOptions.map((item) => (
              <FilterButton key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* Report Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categorias de Relatórios</Text>
          {filteredCategories.map((category) => (
            <ReportCategory key={category.id} category={category} />
          ))}
        </View>

        {/* Recent Reports */}
        <View style={styles.recentReportsContainer}>
          <View style={styles.recentReportsHeader}>
            <Text style={styles.sectionTitle}>Relatórios Recentes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recentReportsList}>
            {recentReports.map((report) => (
              <RecentReportItem key={report.id} report={report} />
            ))}
          </View>
        </View>

        {/* Export Options */}
        <View style={styles.exportContainer}>
          <Text style={styles.sectionTitle}>Opções de Exportação</Text>
          <View style={styles.exportOptions}>
            <TouchableOpacity style={styles.exportButton}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.exportButtonText}>PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <Ionicons
                name="grid-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.exportButtonText}>Excel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.exportButtonText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <Ionicons
                name="cloud-upload-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.exportButtonText}>Cloud</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.modalCancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.modalSaveButton}>Aplicar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSectionTitle}>Período</Text>
            {dateRangeOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.modalOption,
                  dateRange === option.id && styles.modalOptionSelected,
                ]}
                onPress={() => setDateRange(option.id)}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    dateRange === option.id && styles.modalOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {dateRange === option.id && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Export Modal */}
      <Modal
        visible={showExportModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowExportModal(false)}>
              <Text style={styles.modalCancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Exportar Relatórios</Text>
            <View style={{ width: 60 }} />
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSectionTitle}>Formato de Exportação</Text>
            <View style={styles.exportModalOptions}>
              <TouchableOpacity
                style={styles.exportModalButton}
                onPress={() => handleExportReport("PDF")}
              >
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color={theme.colors.error}
                />
                <Text style={styles.exportModalButtonText}>PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exportModalButton}
                onPress={() => handleExportReport("Excel")}
              >
                <Ionicons
                  name="grid-outline"
                  size={24}
                  color={theme.colors.success}
                />
                <Text style={styles.exportModalButtonText}>Excel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exportModalButton}
                onPress={() => handleExportReport("CSV")}
              >
                <Ionicons
                  name="list-outline"
                  size={24}
                  color={theme.colors.info}
                />
                <Text style={styles.exportModalButtonText}>CSV</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Report Generation Modal */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowReportModal(false)}>
              <Text style={styles.modalCancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Gerar Relatório</Text>
            <View style={{ width: 60 }} />
          </View>
          <ScrollView style={styles.modalContent}>
            {selectedReport && (
              <>
                <View style={styles.reportModalInfo}>
                  <Text style={styles.reportModalName}>
                    {selectedReport.name}
                  </Text>
                  <Text style={styles.reportModalDescription}>
                    {selectedReport.description}
                  </Text>
                </View>
                <Text style={styles.modalSectionTitle}>Configurações</Text>
                <View style={styles.reportModalOptions}>
                  <TouchableOpacity style={styles.reportModalButton}>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.reportModalButtonText}>
                      Selecionar Período
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reportModalButton}>
                    <Ionicons
                      name="options-outline"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.reportModalButtonText}>
                      Filtros Avançados
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reportModalButton}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.reportModalButtonText}>
                      Enviar por Email
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.generateReportButton}
                  onPress={() => {
                    Alert.alert(
                      "Relatório Gerado",
                      "Relatório gerado com sucesso!"
                    );
                    setShowReportModal(false);
                  }}
                >
                  <LinearGradient
                    colors={theme.colors.gradients.primary}
                    style={styles.generateReportGradient}
                  >
                    <Ionicons
                      name="play-outline"
                      size={20}
                      color={theme.colors.white}
                    />
                    <Text style={styles.generateReportButtonText}>
                      Gerar Relatório
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
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
    backgroundColor: theme.colors.white,
    ...theme.shadows.sm,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  statsSummary: {
    marginTop: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.gray200,
    marginHorizontal: theme.spacing.sm,
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
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
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
  },
  quickReportsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  quickReportsList: {
    // Layout vertical - sem estilos especiais necessários
  },
  quickReportCard: {
    width: "100%",
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
  },
  quickReportContent: {
    padding: theme.spacing.lg,
    minHeight: 160,
  },
  quickReportHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  quickReportHeaderInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  quickReportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  quickReportStatus: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    alignSelf: "flex-start",
    marginTop: theme.spacing.xs,
  },
  quickReportStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  quickReportStatusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  quickReportBody: {
    marginBottom: theme.spacing.md,
  },
  quickReportTitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: 24,
  },
  quickReportDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  quickReportFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quickReportMeta: {
    flex: 1,
  },
  quickReportMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  quickReportMetaText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  quickReportButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  categoryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  categoryDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  reportsList: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
    paddingTop: theme.spacing.md,
  },
  reportItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  reportInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  },
  reportDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  reportActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  generateButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + "20",
    marginRight: theme.spacing.sm,
  },
  scheduleButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.warning + "20",
  },
  recentReportsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  recentReportsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  recentReportsList: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  recentReportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  recentReportInfo: {
    flex: 1,
  },
  recentReportName: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  },
  recentReportCategory: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  recentReportDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textDisabled,
  },
  recentReportRight: {
    alignItems: "flex-end",
  },
  recentReportMeta: {
    alignItems: "flex-end",
    marginBottom: theme.spacing.sm,
  },
  recentReportSize: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  recentReportFormat: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  recentReportFormatText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  recentReportDownload: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + "20",
  },
  exportContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  exportOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exportButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  exportButtonText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  // Modal styles
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
  modalSectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  modalOptionSelected: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  modalOptionText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
  },
  modalOptionTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  exportModalOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exportModalButton: {
    flex: 1,
    alignItems: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  exportModalButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    marginTop: theme.spacing.sm,
  },
  reportModalInfo: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  reportModalName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  reportModalDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  reportModalOptions: {
    marginBottom: theme.spacing.lg,
  },
  reportModalButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  reportModalButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.md,
  },
  generateReportButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  generateReportGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  generateReportButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.sm,
  },
});

export default ReportsScreen;

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
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";
import theme from "../styles/theme";

const { width } = Dimensions.get("window");

const ChartsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const navigation = useNavigation();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const periodOptions = [
    { id: "week", label: "7 dias", icon: "calendar-outline" },
    { id: "month", label: "30 dias", icon: "calendar-outline" },
    { id: "quarter", label: "3 meses", icon: "calendar-outline" },
    { id: "year", label: "1 ano", icon: "calendar-outline" },
  ];

  // Dados dos gráficos
  const pieChartData = [
    {
      name: "Disponíveis",
      population: 142,
      color: "#4CAF50",
      legendFontColor: theme.colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: "Manutenção",
      population: 23,
      color: "#FF9800",
      legendFontColor: theme.colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: "Vencidos",
      population: 15,
      color: "#F44336",
      legendFontColor: theme.colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: "Em Uso",
      population: 20,
      color: "#2196F3",
      legendFontColor: theme.colors.textPrimary,
      legendFontSize: 12,
    },
  ];

  const barChartData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        data: [12, 8, 15, 10, 18, 14],
      },
    ],
  };

  const lineChartData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        data: [45, 48, 52, 49, 55, 58],
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      },
      {
        data: [12, 8, 15, 10, 18, 14],
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
      },
    ],
  };

  const progressChartData = {
    labels: ["UTI", "Emergência", "Cirúrgico", "Cardiologia"],
    data: [0.85, 0.78, 0.92, 0.88],
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(60, 60, 67, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#1976D2",
    },
    propsForBackgroundLines: {
      strokeDasharray: "3,3",
      stroke: "#E0E0E0",
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: "500",
    },
    propsForVerticalLabels: {
      fontSize: 11,
      fontWeight: "500",
    },
    propsForHorizontalLabels: {
      fontSize: 11,
      fontWeight: "500",
    },
  };

  // Componente de estatística
  const StatCard = ({ title, value, subtitle, icon, color, trend }) => (
    <View style={styles.statCard}>
      <View style={styles.statLeft}>
        <View style={[styles.statIconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon} size={20} color={theme.colors.white} />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
      {trend && (
        <View
          style={[
            styles.trendContainer,
            {
              backgroundColor:
                trend > 0
                  ? theme.colors.success + "20"
                  : theme.colors.error + "20",
            },
          ]}
        >
          <Ionicons
            name={trend > 0 ? "trending-up" : "trending-down"}
            size={14}
            color={trend > 0 ? theme.colors.success : theme.colors.error}
          />
          <Text
            style={[
              styles.trendValue,
              { color: trend > 0 ? theme.colors.success : theme.colors.error },
            ]}
          >
            {Math.abs(trend)}%
          </Text>
        </View>
      )}
    </View>
  );

  // Componente de card de gráfico
  const ChartCard = ({ title, subtitle, icon, children }) => (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <View style={styles.chartTitleSection}>
          <View style={styles.chartIconWrapper}>
            <Ionicons name={icon} size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.chartTitleContainer}>
            <Text style={styles.chartTitle}>{title}</Text>
            {subtitle && <Text style={styles.chartSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        <TouchableOpacity style={styles.chartMenuButton}>
          <Ionicons
            name="ellipsis-horizontal"
            size={18}
            color={theme.colors.textSecondary}
            ara
          />
        </TouchableOpacity>
      </View>
      <View style={styles.chartBody}>{children}</View>
    </View>
  );

  // Componente de botão de período
  const PeriodButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        selectedPeriod === item.id && styles.periodButtonActive,
      ]}
      onPress={() => setSelectedPeriod(item.id)}
    >
      <Ionicons
        name={item.icon}
        size={20}
        color={
          selectedPeriod === item.id ? theme.colors.white : theme.colors.primary
        }
      />
      <Text
        style={[
          styles.periodButtonText,
          selectedPeriod === item.id && styles.periodButtonTextActive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
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
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconContainer}>
                <Ionicons
                  name="analytics"
                  size={28}
                  color={theme.colors.white}
                />
              </View>
              <View>
                <Text style={styles.headerTitle}>Análises e Gráficos</Text>
                <Text style={styles.headerSubtitle}>
                  Visualizações dos dados dos ativos
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons
                name="options-outline"
                size={24}
                color={theme.colors.white}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Total de Ativos"
            value="200"
            subtitle="Equipamentos cadastrados"
            icon="cube-outline"
            color={theme.colors.primary}
            trend={5.2}
          />
          <StatCard
            title="Em Manutenção"
            value="23"
            subtitle="Precisam de atenção"
            icon="construct-outline"
            color={theme.colors.warning}
            trend={-2.1}
          />
          <StatCard
            title="Disponíveis"
            value="142"
            subtitle="Prontos para uso"
            icon="checkmark-circle-outline"
            color={theme.colors.success}
            trend={3.8}
          />
        </View>

        {/* Seletor de Período */}
        <View style={styles.periodSection}>
          <View style={styles.periodHeader}>
            <Text style={styles.periodSectionTitle}>Período de Análise</Text>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.periodFiltersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {periodOptions.map((item) => (
                <PeriodButton key={item.id} item={item} />
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Gráfico de Barras Horizontais */}
        <ChartCard
          title="Distribuição por Status"
          subtitle="Status atual dos equipamentos"
          icon="bar-chart-outline"
        >
          <View style={styles.statusBarsContainer}>
            {pieChartData.map((item, index) => {
              const percentage = ((item.population / 200) * 100).toFixed(1);
              return (
                <View key={index} style={styles.statusBarItem}>
                  <View style={styles.statusBarHeader}>
                    <View style={styles.statusBarLabel}>
                      <View
                        style={[
                          styles.statusBarDot,
                          { backgroundColor: item.color },
                        ]}
                      />
                      <Text style={styles.statusBarText}>{item.name}</Text>
                    </View>
                    <Text style={styles.statusBarValue}>{item.population}</Text>
                  </View>
                  <View style={styles.statusBarTrack}>
                    <View
                      style={[
                        styles.statusBarFill,
                        {
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.statusBarPercentage}>{percentage}%</Text>
                </View>
              );
            })}
          </View>
        </ChartCard>

        {/* Gráfico de Barras */}
        <ChartCard
          title="Tendência de Manutenções"
          subtitle="Número de manutenções por mês"
          icon="bar-chart-outline"
        >
          <BarChart
            data={barChartData}
            width={width - 100}
            height={200}
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            showValuesOnTopOfBars
            fromZero
            style={styles.chart}
          />
        </ChartCard>

        {/* Gráfico de Linha */}
        <ChartCard
          title="Eficiência vs Manutenções"
          subtitle="Comparação de métricas ao longo do tempo"
          icon="trending-up-outline"
        >
          <View style={styles.lineChartLegend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#4CAF50" }]}
              />
              <Text style={styles.legendLabel}>Eficiência %</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#FF9800" }]}
              />
              <Text style={styles.legendLabel}>Manutenções</Text>
            </View>
          </View>
          <LineChart
            data={lineChartData}
            width={width - 100}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={true}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={true}
            withHorizontalLines={true}
          />
        </ChartCard>

        {/* Gráfico de Progresso */}
        <ChartCard
          title="Eficiência por Departamento"
          subtitle="Percentual de funcionamento por setor"
          icon="speedometer-outline"
        >
          <ProgressChart
            data={progressChartData}
            width={width - 120}
            height={180}
            strokeWidth={6}
            radius={16}
            chartConfig={chartConfig}
            hideLegend={false}
            style={styles.chart}
          />
        </ChartCard>
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.8)",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
  },
  statLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
    ...theme.shadows.sm,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  statTitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  trendValue: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  periodSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  periodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  periodSectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  periodFiltersContainer: {
    paddingVertical: theme.spacing.md,
  },
  periodButton: {
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
  periodButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  periodButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginLeft: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  periodButtonText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  periodButtonTextActive: {
    color: theme.colors.white,
  },
  chartCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
    overflow: "hidden",
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  chartTitleSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  chartIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  chartTitleContainer: {
    flex: 1,
  },
  chartTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  chartSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  chartMenuButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  chartBody: {
    padding: theme.spacing.md,
  },
  chart: {
    borderRadius: 12,
  },
  statusBarsContainer: {
    width: "100%",
  },
  statusBarItem: {
    marginBottom: theme.spacing.lg,
  },
  statusBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  statusBarLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBarDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  statusBarText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textPrimary,
  },
  statusBarValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  statusBarTrack: {
    height: 8,
    backgroundColor: theme.colors.gray200,
    borderRadius: 4,
    marginBottom: theme.spacing.xs,
  },
  statusBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  statusBarPercentage: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  lineChartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.lg,
  },
});

export default ChartsScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import theme from "../styles/theme";

const { width } = Dimensions.get("window");

const SearchAssetScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const navigation = useNavigation();

  const filterOptions = [
    { id: "all", label: "Todos", icon: "grid-outline" },
    { id: "available", label: "Disponíveis", icon: "checkmark-circle-outline" },
    { id: "maintenance", label: "Manutenção", icon: "construct-outline" },
    { id: "expired", label: "Vencidos", icon: "time-outline" },
  ];

  const mockAssets = [
    {
      id: "1",
      name: "Monitor de Pressão Arterial",
      model: "Philips IntelliVue MP70",
      location: "Sala 201 - Cardiologia",
      status: "available",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-07-15",
      serialNumber: "MP70-2024-001",
    },
    {
      id: "2",
      name: "Raio-X Móvel",
      model: "Siemens Mobilett Mira Max",
      location: "Sala 105 - Radiologia",
      status: "maintenance",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10",
      serialNumber: "MM-2024-002",
    },
    {
      id: "3",
      name: "Desfibrilador",
      model: "Philips HeartStart FRx",
      location: "Sala 203 - Emergência",
      status: "available",
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-07-20",
      serialNumber: "HS-2024-003",
    },
    {
      id: "4",
      name: "Ventilador Mecânico",
      model: "Hamilton C3",
      location: "UTI - Sala 301",
      status: "expired",
      lastMaintenance: "2023-12-01",
      nextMaintenance: "2024-01-01",
      serialNumber: "HC3-2024-004",
    },
    {
      id: "5",
      name: "Ultrassom Portátil",
      model: "GE Vivid iq",
      location: "Sala 108 - Ultrassonografia",
      status: "available",
      lastMaintenance: "2024-01-18",
      nextMaintenance: "2024-07-18",
      serialNumber: "GE-VI-2024-005",
    },
    {
      id: "6",
      name: "Bomba de Infusão",
      model: "Baxter Sigma Spectrum",
      location: "UTI - Sala 302",
      status: "available",
      lastMaintenance: "2024-01-12",
      nextMaintenance: "2024-07-12",
      serialNumber: "BS-2024-006",
    },
    {
      id: "7",
      name: "Monitor Multiparâmetro",
      model: "Mindray BeneVision N22",
      location: "Sala 204 - Emergência",
      status: "maintenance",
      lastMaintenance: "2024-01-08",
      nextMaintenance: "2024-02-08",
      serialNumber: "MN22-2024-007",
    },
    {
      id: "8",
      name: "Mesa Cirúrgica",
      model: "Maquet Alphamaxx",
      location: "Centro Cirúrgico - Sala 1",
      status: "available",
      lastMaintenance: "2024-01-25",
      nextMaintenance: "2024-07-25",
      serialNumber: "MA-2024-008",
    },
    {
      id: "9",
      name: "Lâmpada Cirúrgica",
      model: "Getinge Maquet PowerLED",
      location: "Centro Cirúrgico - Sala 2",
      status: "available",
      lastMaintenance: "2024-01-22",
      nextMaintenance: "2024-07-22",
      serialNumber: "GM-PL-2024-009",
    },
    {
      id: "10",
      name: "Autoclave",
      model: "Getinge 8666",
      location: "Central de Material - Sala 401",
      status: "expired",
      lastMaintenance: "2023-11-15",
      nextMaintenance: "2024-01-15",
      serialNumber: "G8666-2024-010",
    },
    {
      id: "11",
      name: "Eletrocardiógrafo",
      model: "GE MAC 5500 HD",
      location: "Sala 205 - Cardiologia",
      status: "available",
      lastMaintenance: "2024-01-14",
      nextMaintenance: "2024-07-14",
      serialNumber: "GM5500-2024-011",
    },
    {
      id: "12",
      name: "Oxímetro de Pulso",
      model: "Masimo Radical-7",
      location: "UTI - Sala 303",
      status: "available",
      lastMaintenance: "2024-01-16",
      nextMaintenance: "2024-07-16",
      serialNumber: "MR7-2024-012",
    },
    {
      id: "13",
      name: "Termômetro Digital",
      model: "Braun ThermoScan 7",
      location: "Sala 109 - Pediatria",
      status: "maintenance",
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-02-05",
      serialNumber: "BT7-2024-013",
    },
    {
      id: "14",
      name: "Estetoscópio Digital",
      model: "3M Littmann CORE",
      location: "Sala 206 - Clínica Médica",
      status: "available",
      lastMaintenance: "2024-01-19",
      nextMaintenance: "2024-07-19",
      serialNumber: "3MLC-2024-014",
    },
    {
      id: "15",
      name: "Glicosímetro",
      model: "Roche Accu-Chek Guide",
      location: "Sala 110 - Endocrinologia",
      status: "available",
      lastMaintenance: "2024-01-17",
      nextMaintenance: "2024-07-17",
      serialNumber: "RAG-2024-015",
    },
    {
      id: "16",
      name: "Nebulizador",
      model: "Philips Respironics InnoSpire",
      location: "Sala 207 - Pneumologia",
      status: "expired",
      lastMaintenance: "2023-12-20",
      nextMaintenance: "2024-01-20",
      serialNumber: "PRI-2024-016",
    },
    {
      id: "17",
      name: "Seringa Elétrica",
      model: "Baxter Flo-Gard 6201",
      location: "UTI - Sala 304",
      status: "available",
      lastMaintenance: "2024-01-21",
      nextMaintenance: "2024-07-21",
      serialNumber: "BF6201-2024-017",
    },
    {
      id: "18",
      name: "Cama Hospitalar",
      model: "Hill-Rom Progressa",
      location: "Sala 208 - Enfermaria",
      status: "available",
      lastMaintenance: "2024-01-13",
      nextMaintenance: "2024-07-13",
      serialNumber: "HRP-2024-018",
    },
    {
      id: "19",
      name: "Colchão Anti-Úlcera",
      model: "Hill-Rom Duo 2",
      location: "Sala 209 - Enfermaria",
      status: "maintenance",
      lastMaintenance: "2024-01-07",
      nextMaintenance: "2024-02-07",
      serialNumber: "HRD2-2024-019",
    },
    {
      id: "20",
      name: "Aspirador Cirúrgico",
      model: "Medela Symphony",
      location: "Centro Cirúrgico - Sala 3",
      status: "available",
      lastMaintenance: "2024-01-23",
      nextMaintenance: "2024-07-23",
      serialNumber: "MS-2024-020",
    },
    {
      id: "21",
      name: "Bisturi Elétrico",
      model: "Valleylab Force FX",
      location: "Centro Cirúrgico - Sala 4",
      status: "available",
      lastMaintenance: "2024-01-11",
      nextMaintenance: "2024-07-11",
      serialNumber: "VF-FX-2024-021",
    },
    {
      id: "22",
      name: "Endoscópio",
      model: "Olympus EVIS EXERA III",
      location: "Sala 111 - Endoscopia",
      status: "expired",
      lastMaintenance: "2023-12-10",
      nextMaintenance: "2024-01-10",
      serialNumber: "OEE3-2024-022",
    },
    {
      id: "23",
      name: "Colonoscópio",
      model: "Pentax EC-3890LK",
      location: "Sala 112 - Endoscopia",
      status: "available",
      lastMaintenance: "2024-01-24",
      nextMaintenance: "2024-07-24",
      serialNumber: "PE3890-2024-023",
    },
    {
      id: "24",
      name: "Laringoscópio",
      model: "Karl Storz 10301A",
      location: "Sala 210 - Anestesiologia",
      status: "available",
      lastMaintenance: "2024-01-09",
      nextMaintenance: "2024-07-09",
      serialNumber: "KS10301-2024-024",
    },
    {
      id: "25",
      name: "Máscara de Anestesia",
      model: "Dräger Primus",
      location: "Sala 211 - Anestesiologia",
      status: "maintenance",
      lastMaintenance: "2024-01-06",
      nextMaintenance: "2024-02-06",
      serialNumber: "DP-2024-025",
    },
    {
      id: "26",
      name: "Respirador",
      model: "Hamilton C1",
      location: "UTI - Sala 305",
      status: "available",
      lastMaintenance: "2024-01-26",
      nextMaintenance: "2024-07-26",
      serialNumber: "HC1-2024-026",
    },
    {
      id: "27",
      name: "Capnógrafo",
      model: "Philips IntelliVue MX800",
      location: "Sala 212 - Anestesiologia",
      status: "available",
      lastMaintenance: "2024-01-27",
      nextMaintenance: "2024-07-27",
      serialNumber: "PIM800-2024-027",
    },
    {
      id: "28",
      name: "Doppler Vascular",
      model: "SonoSite M-Turbo",
      location: "Sala 113 - Vascular",
      status: "expired",
      lastMaintenance: "2023-12-05",
      nextMaintenance: "2024-01-05",
      serialNumber: "SMT-2024-028",
    },
    {
      id: "29",
      name: "Holter 24h",
      model: "GE SEER Light",
      location: "Sala 213 - Cardiologia",
      status: "available",
      lastMaintenance: "2024-01-28",
      nextMaintenance: "2024-07-28",
      serialNumber: "GSL-2024-029",
    },
    {
      id: "30",
      name: "MAPA",
      model: "Spacelabs 90217",
      location: "Sala 214 - Cardiologia",
      status: "available",
      lastMaintenance: "2024-01-29",
      nextMaintenance: "2024-07-29",
      serialNumber: "S90217-2024-030",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return theme.colors.success;
      case "maintenance":
        return theme.colors.warning;
      case "expired":
        return theme.colors.error;
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
      default:
        return "Desconhecido";
    }
  };

  const filteredAssets = mockAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" || asset.status === selectedFilter;

    return matchesSearch && matchesFilter;
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

  const AssetCard = ({ item }) => (
    <TouchableOpacity
      style={styles.assetCard}
      onPress={() => navigation.navigate("AssetDetail", { asset: item })}
    >
      <View style={styles.assetHeader}>
        <View style={styles.assetInfo}>
          <Text style={styles.assetName}>{item.name}</Text>
          <Text style={styles.assetModel}>{item.model}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.assetDetails}>
        <View style={styles.detailRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name="barcode-outline"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.detailText}>{item.serialNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.detailText}>
            Próxima manutenção:{" "}
            {new Date(item.nextMaintenance).toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </View>

      <View style={styles.assetActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("AssetDetail", { asset: item })}
        >
          <Ionicons name="eye-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.actionButtonText}>Ver Detalhes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonPrimary]}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={theme.colors.white}
          />
          <Text
            style={[styles.actionButtonText, styles.actionButtonTextPrimary]}
          >
            Editar
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buscar Ativos</Text>
        <TouchableOpacity>
          <Ionicons
            name="filter-outline"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={20}
            color={theme.colors.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome, modelo, localização..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          )}
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

      {/* Results */}
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {filteredAssets.length} ativo
            {filteredAssets.length !== 1 ? "s" : ""} encontrado
            {filteredAssets.length !== 1 ? "s" : ""}
          </Text>
        </View>

        <FlatList
          data={filteredAssets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AssetCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.assetsList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
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
  resultsContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  resultsHeader: {
    paddingVertical: theme.spacing.md,
  },
  resultsTitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  assetsList: {
    paddingBottom: theme.spacing.xl,
  },
  assetCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  assetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  assetModel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  assetDetails: {
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  assetActions: {
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
  actionButtonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  actionButtonText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  actionButtonTextPrimary: {
    color: theme.colors.white,
  },
});

export default SearchAssetScreen;

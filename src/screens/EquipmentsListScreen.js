import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { equipmentApi } from "../services/api";
import theme from "../styles/theme";

const STATUS_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Disponíveis", value: "DISPONIVEL" },
  { label: "Em uso", value: "EM_USO" },
  { label: "Em manutenção", value: "EM_MANUTENCAO" },
  { label: "Inativos", value: "INATIVO" },
  { label: "Sucateados", value: "SUCATEADO" },
];

const PAGE_LIMIT = 10;

const parseListResponse = (response) => {
  if (Array.isArray(response)) {
    return { items: response, meta: null };
  }

  if (response && Array.isArray(response.data)) {
    return { items: response.data, meta: response.meta ?? null };
  }

  if (response?.items) {
    return { items: response.items, meta: response.meta ?? null };
  }

  return { items: [], meta: null };
};

const EquipmentsListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [filters, setFilters] = useState({
    nome: "",
    statusOperacional: "",
  });
  const filtersRef = useRef(filters);
  const [equipments, setEquipments] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const loadEquipments = useCallback(
    async (requestedPage = 1, append = false, customFilters) => {
      const activeFilters = customFilters ?? filtersRef.current;

      if (append) {
        setLoadingMore(true);
      } else if (requestedPage === 1 && !refreshing) {
        setLoading(true);
      }

      try {
        const response = await equipmentApi.list({
          ...activeFilters,
          page: requestedPage,
          limit: PAGE_LIMIT,
        });

        const { items, meta } = parseListResponse(response);
        setEquipments((prev) => (append ? [...prev, ...items] : items));
        setPage(requestedPage);
        setMeta(meta);

        if (meta && typeof meta.totalPages === "number") {
          setHasMore(requestedPage < meta.totalPages);
        } else {
          setHasMore(items.length === PAGE_LIMIT);
        }
      } catch (error) {
        console.error("Erro ao carregar equipamentos:", error);
        Alert.alert(
          "Erro",
          error?.message ||
            error?.data?.message ||
            "Não foi possível carregar os equipamentos."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [refreshing]
  );

  useFocusEffect(
    useCallback(() => {
      loadEquipments(1, false);
    }, [loadEquipments])
  );

  useEffect(() => {
    if (route.params?.refresh) {
      loadEquipments(1, false);
    }
  }, [route.params?.refresh, loadEquipments]);

  const handleSearch = () => {
    filtersRef.current = filters;
    loadEquipments(1, false, filters);
  };

  const handleClearFilters = () => {
    const cleared = { nome: "", statusOperacional: "" };
    filtersRef.current = cleared;
    setFilters(cleared);
    loadEquipments(1, false, cleared);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadEquipments(1, false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadEquipments(page + 1, true);
    }
  };

  const handleSelectEquipment = (equipment) => {
    navigation.navigate("EquipmentDetail", {
      equipmentId: equipment.id,
      equipment,
    });
  };

  const handleCreate = () => {
    navigation.navigate("EquipmentForm", { mode: "create" });
  };

  const renderStatusOption = ({ label, value }) => {
    const selected = filters.statusOperacional === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.statusChip, selected && styles.statusChipSelected]}
        onPress={() => {
          const nextValue = selected ? "" : value;
          const updatedFilters = {
            ...filters,
            statusOperacional: nextValue,
          };
          filtersRef.current = updatedFilters;
          setFilters(updatedFilters);
          loadEquipments(1, false, updatedFilters);
        }}
      >
        <Text
          style={[
            styles.statusChipText,
            selected && styles.statusChipTextSelected,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSelectEquipment(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <View
          style={[
            styles.statusPill,
            styles[`status_${item.statusOperacional}`] || styles.statusDefault,
          ]}
        >
          <Text style={styles.statusPillText}>
            {item.statusOperacional?.replace(/_/g, " ") ?? "Sem status"}
          </Text>
        </View>
      </View>
      <View style={styles.cardRow}>
        <Ionicons
          name="construct-outline"
          size={16}
          color={theme.colors.textSecondary}
          style={styles.cardIcon}
        />
        <Text style={styles.cardValue}>
          {item.tipo || "Tipo não informado"}
        </Text>
      </View>
      <View style={styles.cardRow}>
        <Ionicons
          name="business-outline"
          size={16}
          color={theme.colors.textSecondary}
          style={styles.cardIcon}
        />
        <Text style={styles.cardValue}>
          {item.setorAtual || "Setor não informado"}
        </Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardFooterText}>
          Modelo: {item.modelo || "N/A"}
        </Text>
        {item.updatedAt && (
          <Text style={styles.cardFooterText}>
            Atualizado em: {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const listEmptyComponent = () => {
    if (loading) {
      return null;
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="medical-outline"
          size={48}
          color={theme.colors.textSecondary}
          style={{ marginBottom: theme.spacing.md }}
        />
        <Text style={styles.emptyTitle}>Nenhum equipamento encontrado</Text>
        <Text style={styles.emptySubtitle}>
          Ajuste os filtros ou cadastre um novo equipamento.
        </Text>
      </View>
    );
  };

  const totalEquipments = meta?.total ?? equipments.length;
  const statusFiltersActive = Boolean(
    filters.nome.trim() || filters.statusOperacional
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={theme.colors.gradients.primary}
        style={styles.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.heroContent}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Equipamentos</Text>
            <Text style={styles.heroSubtitle}>
              Gerencie o inventário hospitalar com agilidade
            </Text>
          </View>
          <View style={styles.heroBadge}>
            <Ionicons
              name="medkit-outline"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.heroBadgeText}>
              {totalEquipments} itens cadastrados
            </Text>
          </View>
        </View>
        <View style={styles.heroStats}>
          <View style={styles.heroStatCard}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={theme.colors.success}
            />
            <View style={styles.heroStatText}>
              <Text style={styles.heroStatLabel}>Disponíveis</Text>
              <Text style={styles.heroStatValue}>
                {
                  equipments.filter(
                    (item) => item.statusOperacional === "DISPONIVEL"
                  ).length
                }
              </Text>
            </View>
          </View>
          <View style={styles.heroStatCard}>
            <Ionicons name="construct" size={18} color={theme.colors.warning} />
            <View style={styles.heroStatText}>
              <Text style={styles.heroStatLabel}>Em manutenção</Text>
              <Text style={styles.heroStatValue}>
                {
                  equipments.filter(
                    (item) => item.statusOperacional === "EM_MANUTENCAO"
                  ).length
                }
              </Text>
            </View>
          </View>
          <View style={styles.heroStatCard}>
            <Ionicons name="time" size={18} color={theme.colors.info} />
            <View style={styles.heroStatText}>
              <Text style={styles.heroStatLabel}>Atualizado em</Text>
              <Text style={styles.heroStatValue}>
                {new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.filterCard}>
        <View style={styles.filterHeader}>
          <View>
            <Text style={styles.filterTitle}>Filtros rápidos</Text>
            <Text style={styles.filterSubtitle}>
              Refine a busca por status e nome
            </Text>
          </View>
          {statusFiltersActive && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearFilters}
            >
              <Ionicons
                name="refresh-outline"
                size={16}
                color={theme.colors.primary}
                style={{ marginRight: theme.spacing.xs }}
              />
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <Ionicons
              name="search-outline"
              size={20}
              color={theme.colors.textSecondary}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nome ou código patrimonial"
              placeholderTextColor={theme.colors.textSecondary}
              value={filters.nome}
              onChangeText={(text) =>
                setFilters((prev) => ({ ...prev, nome: text }))
              }
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusChipsRow}
        >
          {STATUS_OPTIONS.map(renderStatusOption)}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading && !refreshing && equipments.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={equipments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={renderHeader}
          ListHeaderComponentStyle={styles.listHeaderComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={listEmptyComponent}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadingMore}>
                <ActivityIndicator color={theme.colors.primary} />
              </View>
            ) : null
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleCreate}>
        <Ionicons name="add" size={28} color={theme.colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  hero: {
    borderRadius: theme.borderRadius.xxl,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.md,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.lg,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 20,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.xs,
  },
  heroBadgeText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  heroStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  heroStatCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  heroStatText: {
    flex: 1,
  },
  heroStatLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: theme.typography.fontSize.xs,
  },
  heroStatValue: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  filterCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xxl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  filterSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSize.md,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  statusChipsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingRight: theme.spacing.sm,
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
    fontWeight: theme.typography.fontWeight.medium,
  },
  statusChipTextSelected: {
    color: theme.colors.primary,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  clearButtonText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl * 2,
    paddingTop: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    flex: 1,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.sm,
  },
  statusPill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray100,
  },
  statusDefault: {
    backgroundColor: theme.colors.gray100,
  },
  statusPillText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
  },
  status_DISPONIVEL: {
    backgroundColor: theme.colors.success + "20",
  },
  status_EM_USO: {
    backgroundColor: theme.colors.info + "20",
  },
  status_EM_MANUTENCAO: {
    backgroundColor: theme.colors.warning + "20",
  },
  status_INATIVO: {
    backgroundColor: theme.colors.gray200,
  },
  status_SUCATEADO: {
    backgroundColor: theme.colors.error + "20",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  cardIcon: {
    marginRight: theme.spacing.sm,
  },
  cardValue: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
  cardFooter: {
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray200,
    paddingTop: theme.spacing.sm,
  },
  cardFooterText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingMore: {
    paddingVertical: theme.spacing.md,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.lg,
  },
});

export default EquipmentsListScreen;

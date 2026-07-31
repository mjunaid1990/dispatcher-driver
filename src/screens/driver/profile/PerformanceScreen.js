import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/client';
import { useDriver } from '../../../hooks/useDriver';
import ScreenHeader from '../../../components/ScreenHeader';
import { colors, spacing, borderRadius, typography, elevation } from '../../../theme/theme';
import { showAlert } from '../../../utils/alerts';
import { formatCurrency } from '../../../utils/currency';

const PerformanceScreen = () => {
  const { userInfo } = useAuth();
  const { driver, loading } = useDriver();
  const [ratings, setRatings] = useState([]);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRatings = useCallback(async () => {
    try {
      const res = await api.get('/ratings', { params: { rateeId: userInfo._id } });
      setRatings(res.data || []);
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to load performance data');
    } finally {
      setLoadingRatings(false);
    }
  }, [userInfo]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRatings();
    setRefreshing(false);
  };

  const average =
    ratings.length > 0
      ? ratings.reduce((acc, r) => acc + r.stars, 0) / ratings.length
      : Number(driver?.rating || 0);

  const renderRating = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.stars}>{'★'.repeat(item.stars)}{'☆'.repeat(5 - item.stars)}</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      {!!item.comment && <Text style={styles.comment}>{item.comment}</Text>}
      <Text style={styles.orderRef}>
        {item.orderId?.orderNumber ? `Order #${item.orderId.orderNumber}` : 'Delivery'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Performance" />
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{average ? average.toFixed(1) : '0.0'}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{driver?.totalDeliveries ?? 0}</Text>
          <Text style={styles.statLabel}>Deliveries</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatCurrency(driver?.earningsBalance ?? 0, { decimals: 0 })}
          </Text>
          <Text style={styles.statLabel}>Balance</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Customer Ratings ({ratings.length})</Text>
      {loading || loadingRatings ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.mint} />
        </View>
      ) : (
        <FlatList
          data={ratings}
          keyExtractor={(item) => item._id}
          renderItem={renderRating}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text style={styles.empty}>No ratings yet</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    margin: spacing.lg,
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    flexDirection: 'row',
    justifyContent: 'space-around',
    ...elevation.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  empty: {
    textAlign: 'center',
    color: colors.textTertiary,
    fontSize: typography.fontSize.base,
    marginTop: spacing['4xl'],
  },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...elevation.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stars: {
    fontSize: typography.fontSize.base,
    color: colors.warning,
  },
  date: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
  comment: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  orderRef: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
});

export default PerformanceScreen;
